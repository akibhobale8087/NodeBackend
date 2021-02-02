"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passengerService = void 0;

var _models = require("../models");

var _config = require("../config");

var _constants = require("../constants");

var _mongoose = require("mongoose");

const {
  ObjectId
} = _mongoose.Types;
const passengerService = {
  updatePassengerDrive,
  driverSearch,
  findPassenger,
  bookingSave,
  clearDriverNotification,
  clearPassengerDrive,
  savePassengerPushNotificationData,
  passengerNotifications,
  // CurrentRideOrder,
  passengerPreviousRide,
  passengerToDriverRating,
  updateData
};
exports.passengerService = passengerService;

async function clearPassengerDrive(contactNumber) {
  let filter = {
    contactNumber: contactNumber
  };
  return await _models.UserModel.update(filter, {
    $set: {
      userDrive: []
    }
  });
}

async function updatePassengerDrive(userDrive, contactNumber) {
  let filter = {
    contactNumber: contactNumber
  };
  await clearPassengerDrive(contactNumber);
  return await _models.UserModel.update(filter, {
    $push: {
      userDrive: userDrive
    }
  });
}

async function driverSearch(pickUpLocation) {
  // let query = {
  // 	$and: [
  // 		{ isVerified: true },
  // 		{ isActive: true },
  // 		{ role: ROLES[1] },
  // 		{ driverMode: DRIVER_MODE[0] },
  // 	],
  // };
  let result = await _models.UserModel.aggregate([{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [parseFloat(pickUpLocation.coordinates[0]), parseFloat(pickUpLocation.coordinates[1])]
      },
      distanceMultiplier: 0.001,
      maxDistance: _config.DISTANCE,
      spherical: true,
      distanceField: "calcDistance",
      //query: query,
      query: {
        role: _constants.ROLES[1],
        isVerified: true,
        isActive: true,
        driverMode: _constants.DRIVER_MODE[0]
      }
    }
  }]);
  return result;
}

async function findPassenger(userId) {
  return await _models.UserModel.findById({
    _id: ObjectId(userId)
  });
}

async function bookingSave(bookingData) {
  const carBookingModel = new _models.CarBookingModel(bookingData);
  return await carBookingModel.save();
}

async function clearDriverNotification(userId) {
  return await _models.DriverNotificationModel.deleteMany({
    passengerId: ObjectId(userId)
  });
}

async function savePassengerPushNotificationData(pushNotificationdata) {
  const driverNotificationModel = new _models.DriverNotificationModel(pushNotificationdata);
  await driverNotificationModel.save();
}

async function passengerNotifications(passengerId, limit, page, filterData) {
  const filters = {
    type: _constants.PUSHNOTIFICATION_TYPE[0]
  };

  if (passengerId) {
    filters.passengerId = ObjectId(passengerId);
  }

  if (filterData.gender) {
    filters.gender = filterData.gender;
  }

  if (filterData.cartype1) {
    filters.$or = [{
      carType: filterData.cartype1
    }]; //filters.carType = filterData.cartype;

    if (filterData.cartype2) {
      filters.$or.push({
        carType: filterData.cartype2
      });
    }

    if (filterData.cartype3) {
      filters.$or.push({
        carType: filterData.cartype3
      });
    }
  }

  if (filterData.cartype2) {
    filters.$or = [{
      carType: filterData.cartype2
    }]; //filters.carType = filterData.cartype;

    if (filterData.cartype1) {
      filters.$or.push({
        carType: filterData.cartype1
      });
    }

    if (filterData.cartype3) {
      filters.$or.push({
        carType: filterData.cartype3
      });
    }
  }

  if (filterData.cartype3) {
    filters.$or = [{
      carType: filterData.cartype3
    }]; //filters.carType = filterData.cartype;

    if (filterData.cartype1) {
      filters.$or.push({
        carType: filterData.cartype1
      });
    }

    if (filterData.cartype2) {
      filters.$or.push({
        carType: filterData.cartype2
      });
    }
  } // if (filterData.cartype) {
  // 	condition.$or.push({
  // 		$or: [
  // 			{ targetGroup: userDetails.gender },
  // 			{ targetGroup: "female_and_male" },
  // 		],
  // 	});
  // }


  const options = {
    populate: [{
      path: "driverId",
      select: {
        _id: 1,
        userName: 1,
        email: 1,
        role: 1,
        gender: 1,
        contactNumber: 1
      }
    }],
    sort: {
      createdAt: -1
    }
  };

  if (filterData.nearToYou) {
    delete options.sort["createdAt"];
    options.sort.distance = 1;
  }

  if (filterData.highToLow) {
    delete options.sort["createdAt"];
    options.sort.budget = -1;
  }

  if (filterData.lowToHigh) {
    delete options.sort["createdAt"];
    options.sort.budget = 1;
  }

  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.DriverNotificationModel.paginate(filters, options);
} // async function CurrentRideOrder(passengerId) {
// 	return await CarBookingModel.find(
// 		{ passengerId: ObjectId(passengerId) },
// 		{ carName: 1, budget: 1 }
// 	)
// 		.sort({ createdAt: -1 })
// 		.limit(1);
// }


async function passengerPreviousRide(passengerId, limit, page) {
  const filters = {
    // type: PUSHNOTIFICATION_TYPE[0],
    passengerId: passengerId
  };
  const options = {
    populate: [{
      path: "driverId",
      select: {
        _id: 1,
        userName: 1,
        email: 1,
        role: 1,
        gender: 1,
        contactNumber: 1,
        profileImage: 1
      }
    }, {
      path: "passengerId",
      select: {
        _id: 1,
        userName: 1,
        email: 1,
        role: 1,
        gender: 1,
        contactNumber: 1,
        profileImage: 1
      }
    }],
    sort: {
      createdAt: -1
    }
  };
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.CarBookingModel.paginate(filters, options);
}

async function passengerToDriverRating(bookingId, passengerToDriverRating, passengerToDriverComments) {
  return await _models.CarBookingModel.updateOne({
    _id: ObjectId(bookingId)
  }, {
    $set: {
      passengerToDriverRating: passengerToDriverRating,
      passengerToDriverComments: passengerToDriverComments
    }
  });
}

async function updateData(driverId, passengerId) {
  return await _models.DriverNotificationModel.updateMany({
    driverId: driverId,
    passengerId: passengerId
  }, {
    $set: {
      status: true
    }
  });
}