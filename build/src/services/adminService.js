"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminService = void 0;

var _models = require("../models");

var _constants = require("../constants");

var bcrypt = _interopRequireWildcard(require("bcryptjs"));

var _mongoose = require("mongoose");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  ObjectId
} = _mongoose.Types;
const adminService = {
  passengerList,
  driverList,
  updateDriver,
  updateUser,
  carInfo,
  deleteDriver,
  deletePassenger,
  rideLists,
  getAllDrivers,
  getAllPassengers,
  findUser,
  deleteServices,
  serviceList,
  updateServices,
  findById,
  getAllUsers,
  packages,
  packageList,
  updatePackage,
  dashboardData,
  driverInformation
};
/**
 * Update user Data
 * @param {*} userData
 */

exports.adminService = adminService;

async function updateUser(userData) {
  return await _models.UserModel.updateOne({
    _id: ObjectId(userData.id)
  }, {
    $set: userData
  }, // { new: true }
  {
    fields: {
      password: 0,
      wallet: 0,
      emailVerify: 0,
      feesEnd: 0,
      feesStart: 0,
      virtualBalance: 0,
      rating: 0,
      filter: 0,
      location: 0
    },
    new: true
  });
}

async function updateDriver(driverId) {
  return await _models.UserModel.updateOne({
    _id: ObjectId(driverId)
  }, {
    $set: {
      isVerified: true
    }
  });
}

async function findUser(email) {
  return await _models.UserModel.findOne({
    email: email
  }, {
    password: 0,
    wallet: 0,
    emailVerify: 0,
    feesEnd: 0,
    feesStart: 0,
    virtualBalance: 0,
    rating: 0,
    filter: 0,
    location: 0
  });
}

async function deleteServices(id) {
  return await _models.CallingAmountModel.deleteOne({
    _id: ObjectId(id)
  });
}

async function serviceList(limit = 10, skip = 1) {
  let commentData = await _models.CallingAmountModel.aggregate([{
    $skip: (skip - 1) * limit
  }, {
    $limit: limit
  }, {
    $sort: {
      updatedAt: -1
    }
  }]);
  return commentData;
}

async function updateServices(Id, audioCallAmount, videoCallAmount) {
  return await _models.CallingAmountModel.updateOne({
    _id: ObjectId(Id)
  }, {
    $set: {
      audioCallAmount: audioCallAmount,
      videoCallAmount: videoCallAmount
    }
  });
}

async function findById(Id) {
  return await _models.CallingAmountModel.findById({
    _id: ObjectId(Id)
  });
}

async function passengerList(limit, page, passengerData) {
  const filters = {
    role: _constants.ROLES[2]
  };

  if (passengerData.userName) {
    filters.userName = passengerData.userName;
  }

  const options = {
    // populate: [
    // 	{
    // 		path: "driverId",
    // 		select: {
    // 			_id: 1,
    // 			userName: 1,
    // 			email: 1,
    // 			role: 1,
    // 			gender: 1,
    // 			contactNumber: 1,
    // 			profileImage: 1,
    // 		},
    // 	},
    // ],
    sort: {
      createdAt: -1
    }
  };
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.UserModel.paginate(filters, options);
}

async function driverList(limit, page, driverData) {
  const filters = {
    role: _constants.ROLES[1]
  };

  if (driverData.userName) {
    filters.userName = driverData.userName;
  }

  if (driverData.isVerified) {
    filters.isVerified = driverData.isVerified;
  }

  const options = {
    // populate: [
    // 	{
    // 		path: "driverId",
    // 		select: {
    // 			_id: 1,
    // 			userName: 1,
    // 			email: 1,
    // 			role: 1,
    // 			gender: 1,
    // 			contactNumber: 1,
    // 			profileImage: 1,
    // 		},
    // 	},
    // ],
    sort: {
      createdAt: -1
    }
  };
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.UserModel.paginate(filters, options);
}

async function carInfo(driverId) {
  console.log(driverId, "IN SERVIOCE CAR");
  return await _models.CarModel.findOne({
    userId: driverId
  });
}

async function getAllUsers() {
  //{playerId:{$exists: true}}
  return await _models.UserModel.aggregate([{
    $match: {
      playerId: {
        $exists: true
      }
    }
  }, {
    $project: {
      playerId: "$playerId"
    }
  }]);
}

async function getAllDrivers() {
  return await _models.UserModel.aggregate([{
    $match: {
      $and: [{
        role: _constants.ROLES[1]
      }, {
        playerId: {
          $exists: true
        }
      }, {
        isVerified: true
      }]
    }
  }, {
    $project: {
      playerId: "$playerId"
    }
  }]);
}

async function getAllPassengers() {
  return await _models.UserModel.aggregate([{
    $match: {
      $and: [{
        role: _constants.ROLES[2]
      }, {
        playerId: {
          $exists: true
        }
      }, {
        isVerified: true
      }]
    }
  }, {
    $project: {
      playerId: "$playerId"
    }
  }]);
}

async function rideLists(limit, page, passengerId) {
  const filters = {};
  const options = {
    populate: [{
      path: "driverId" // select: {
      // 	_id: 1,
      // 	userName: 1,
      // 	email: 1,
      // 	role: 1,
      // 	gender: 1,
      // 	contactNumber: 1,
      // 	profileImage: 1,
      // },

    }, {
      path: "passengerId" // select: {
      // 	_id: 1,
      // 	userName: 1,
      // 	email: 1,
      // 	role: 1,
      // 	gender: 1,
      // 	contactNumber: 1,
      // 	profileImage: 1,
      // },

    }],
    sort: {
      createdAt: -1
    }
  }; // const options = {
  // 	sort: { createdAt: -1 },
  // };

  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.CarBookingModel.paginate(filters, options);
}

async function deleteDriver(driverId) {
  let carBoookingData = await _models.CarBookingModel.deleteMany({
    driverId: driverId
  });
  let carData = await _models.CarModel.deleteOne({
    userId: driverId
  });
  let chantRecordData = await _models.ChatRecordModel.deleteMany({
    driverId: driverId
  });
  let notificationData = await _models.DriverNotificationModel.deleteMany({
    driverId: driverId
  }); // let lawyerAvailableData = await LawyerAvailableTimesModel.deleteMany({
  // 	lawyerId: lawyerId,
  // });
  // let cashOutData = await CashOutModel.deleteMany({ lawyerId: lawyerId });
  // let bookAppoimentData = await BookAppoimentModel.deleteMany({
  // 	lawyerId: lawyerId,
  // });
  // let views = await ViewsModel.deleteMany({ lawyerId: lawyerId });
  // return await LawyerModel.deleteOne({ userId: lawyerId });

  return await _models.UserModel.deleteOne({
    _id: ObjectId(driverId)
  });
}

async function deletePassenger(passengerId) {
  let booking = await _models.CarBookingModel.deleteMany({
    passengerId: passengerId
  });
  let notificationData = await _models.ChatRecordModel.deleteMany({
    passengerId: passengerId
  });
  let chantRecordData = await _models.DriverNotificationModel.deleteMany({
    passengerId: passengerId
  }); // let paymentData = await NotificationModel.deleteMany({ userId: clientId });
  // let ratingData = await RatingAndCommentsModel.deleteMany({
  // 	userId: clientId,
  // });
  // let Views = await ViewsModel.deleteMany({ userId: clientId });

  return _models.UserModel.deleteOne({
    _id: ObjectId(passengerId)
  });
}

async function packages(packageData) {
  const packageObj = new _models.PackagesModel(packageData);
  return packageObj.save();
}

async function packageList(limit, page) {
  const filters = {};
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

async function updatePackage(packageId, packageData) {
  return await _models.PackagesModel.updateOne({
    _id: ObjectId(packageId)
  }, {
    $set: { ...packageData
    }
  });
}

async function dashboardData() {
  return await _models.UserModel.aggregate([{
    $facet: {
      Drivers: [{
        $match: {
          role: _constants.ROLES[1]
        }
      }, {
        $count: "Drivers"
      }],
      Passengers: [{
        $match: {
          role: _constants.ROLES[2]
        }
      }, {
        $count: "Passengers"
      }],
      IsVerified: [{
        $match: {
          $and: [{
            role: _constants.ROLES[1]
          }, {
            isVerified: true
          }]
        }
      }, {
        $count: "IsVerified"
      }],
      IsNotVerified: [{
        $match: {
          $and: [{
            role: _constants.ROLES[1]
          }, {
            isVerified: false
          }]
        }
      }, {
        $count: "IsNotVerified"
      }]
    }
  }, {
    $project: {
      Drivers: {
        $arrayElemAt: ["$Drivers.Drivers", 0]
      },
      Passengers: {
        $arrayElemAt: ["$Passengers.Passengers", 0]
      },
      IsVerified: {
        $arrayElemAt: ["$IsVerified.IsVerified", 0]
      },
      IsNotVerified: {
        $arrayElemAt: ["$IsNotVerified.IsNotVerified", 0]
      }
    }
  }]);
}

async function driverInformation(driverId) {
  console.log(driverId, "&&&&&&&&&&&&&&&&&&&&&&&&&");
  return await _models.UserModel.aggregate([{
    $match: {
      _id: driverId
    }
  }, {
    $lookup: {
      from: "cars",
      localField: "_id",
      foreignField: "userId",
      as: "driverInfo"
    }
  }, {
    $unwind: "$driverInfo"
  }]);
}