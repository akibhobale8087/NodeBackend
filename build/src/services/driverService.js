"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.driverService = void 0;

var _models = require("../models");

var _mongoose = require("mongoose");

var _constants = require("../constants");

const {
  ObjectId
} = _mongoose.Types;
const driverService = {
  updateLocation,
  changeDriverMode,
  driverNotifications,
  findUser,
  driverRides,
  driverToPassengerRating,
  packageList,
  selectPackage
};
exports.driverService = driverService;

async function updateLocation(driverInfo) {
  return await _models.UserModel.findOneAndUpdate({
    _id: ObjectId(driverInfo._id)
  }, {
    $set: {
      location: driverInfo.location
    }
  }, {
    new: true
  });
}

async function changeDriverMode(driverId) {
  return await _models.UserModel.findByIdAndUpdate({
    _id: ObjectId(driverId)
  }, {
    $set: {
      driverMode: _constants.DRIVER_MODE[2]
    }
  });
}

async function driverNotifications(driverId, limit, page) {
  const filters = {
    type: _constants.PUSHNOTIFICATION_TYPE[1]
  };

  if (driverId) {
    filters.driverId = ObjectId(driverId);
  }

  const options = {
    populate: [{
      path: "passengerId",
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
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.DriverNotificationModel.paginate(filters, options);
}

async function findUser(userId) {
  return await _models.UserModel.findById({
    _id: ObjectId(userId)
  });
}

async function driverRides(driverId, limit, page) {
  const filters = {
    // type: PUSHNOTIFICATION_TYPE[0],
    driverId: driverId
  };
  const options = {
    populate: [{
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
    }, {
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
    }],
    sort: {
      createdAt: -1
    }
  };
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.CarBookingModel.paginate(filters, options);
}

async function driverToPassengerRating(bookingId, driverToPassengerRating, driverToPassengerComments) {
  return await _models.CarBookingModel.updateOne({
    _id: ObjectId(bookingId)
  }, {
    $set: {
      driverToPassengerRating: driverToPassengerRating,
      driverToPassengerComments: driverToPassengerComments
    }
  });
}

async function packageList(limit, page) {
  const filters = {
    isActive: true
  };
  const options = {
    sort: {
      createdAt: -1
    }
  }; // const options = {
  // 	sort: { createdAt: -1 },
  // };

  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.PackagesModel.paginate(filters, options);
}

async function selectPackage(driverPackage) {
  let packageSelect = new _models.DriverHistoryModel(driverPackage);
  return await packageSelect.save();
}