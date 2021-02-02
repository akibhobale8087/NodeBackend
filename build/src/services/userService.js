"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userService = void 0;

var _models = require("../models");

var _mongoose = require("mongoose");

var _config = require("../config");

var _constants = require("../constants");

const bucketUrl = _config.AWSBASEURL;
const {
  ObjectId
} = _mongoose.Types;
const userService = {
  updateUser,
  driverInfo,
  removeNotifications,
  declinebookCab,
  completeRides,
  logoutUser,
  findUserById,
  driverBadgeCounts,
  passengerBadgeCounts,
  varifyed,
  findUser
};
/**
 * Update user Data
 * @param {*} userData
 */

exports.userService = userService;

async function updateUser(userData) {
  return await _models.UserModel.findOneAndUpdate({
    _id: ObjectId(userData._id)
  }, {
    $set: userData
  }, // { new: true }
  {
    fields: {
      password: 0
    },
    new: true
  });
}
/**
 * If user is Driver then return with car information
 * @param {*} userId
 */


async function driverInfo(userId) {
  return _models.UserModel.aggregate([{
    $match: {
      _id: ObjectId(userId)
    }
  }, {
    $lookup: {
      from: "cars",
      localField: "_id",
      foreignField: "userId",
      as: "carInfo"
    }
  }, {
    $unwind: "$carInfo"
  }, {
    $project: {
      _id: "$_id",
      dob: "$dob",
      badge_count: "$badge_count",
      rating: "$rating",
      address: "$address",
      totalRide: "$totalRide",
      contactNumber: "$contactNumber",
      role: "$role",
      udid: "$udid",
      gender: {
        $ifNull: ["$gender", null]
      },
      currentAddress: {
        $ifNull: ["$currentAddress", null]
      },
      signupAddress: {
        $ifNull: ["$signupAddress", null]
      },
      email: {
        $ifNull: ["$email", null]
      },
      driverMode: "$driverMode",
      profileImage: {
        $ifNull: [{
          $concat: [bucketUrl, "/", "$role", "/", {
            $toString: "$_id"
          }, "/", "$profileImage"]
        }, null]
      },
      location: "$location",
      userName: "$userName",
      createdAt: "$createdAt",
      updatedAt: "$updatedAt",
      deviceToken: "$deviceToken",
      token: "$token",
      car: {
        _id: "$carInfo._id",
        carModel: "$carInfo.carModel",
        carType: "$carInfo.carType",
        carName: "$carInfo.carName",
        createdAt: "$carInfo.createdAt",
        updatedAt: "$carInfo.updatedAt",
        carNumber: {
          $ifNull: ["$carInfo.carNumber", null]
        },
        carFrontImage: {
          $ifNull: [{
            $concat: [bucketUrl, "/", "$role", "/", {
              $toString: "$_id"
            }, "/", "$carInfo.carFrontImage"]
          }, null]
        },
        carBackImage: {
          $ifNull: [{
            $concat: [bucketUrl, "/", "$role", "/", {
              $toString: "$_id"
            }, "/", "$carInfo.carBackImage"]
          }, null]
        },
        drivingLicense: {
          $ifNull: [{
            $concat: [bucketUrl, "/", "$role", "/", {
              $toString: "$_id"
            }, "/", "$carInfo.drivingLicense"]
          }, null]
        }
      }
    }
  }]);
}

async function removeNotifications(Id) {
  return await _models.DriverNotificationModel.deleteOne({
    _id: Id
  });
}

async function declinebookCab(bookingId) {
  let bookingData = await _models.CarBookingModel.findOne({
    _id: ObjectId(bookingId)
  });
  await _models.UserModel.updateOne({
    _id: ObjectId(bookingData.driverId)
  }, {
    $set: {
      driverMode: _constants.DRIVER_MODE[0]
    }
  });
  return await _models.CarBookingModel.updateOne({
    _id: ObjectId(bookingId)
  }, {
    $set: {
      status: _constants.CARBOOKING_TYPE[1]
    }
  });
}

async function completeRides(bookingId) {
  let bookingData = await _models.CarBookingModel.findOne({
    _id: ObjectId(bookingId)
  });
  let driverInfo = await _models.UserModel.findOne({
    _id: ObjectId(bookingData.driverId)
  });
  let passengerInfo = await _models.UserModel.findOne({
    _id: ObjectId(bookingData.passengerId)
  });
  let drivertotalRide = parseInt(driverInfo.totalRide) + 1;
  let passengertotalRide = parseInt(passengerInfo.totalRide) + 1;
  await _models.UserModel.updateOne({
    _id: ObjectId(bookingData.passengerId)
  }, {
    $set: {
      totalRide: passengertotalRide
    }
  });
  await _models.UserModel.updateOne({
    _id: ObjectId(bookingData.driverId)
  }, {
    $set: {
      driverMode: _constants.DRIVER_MODE[0],
      totalRide: drivertotalRide
    }
  });
  return await _models.CarBookingModel.updateOne({
    _id: ObjectId(bookingId)
  }, {
    $set: {
      status: _constants.CARBOOKING_TYPE[2]
    }
  });
}

async function logoutUser(userId, role) {
  let set = {
    deviceToken: null,
    token: null,
    isActive: false
  };

  if (role == _constants.ROLES[1]) {
    set.driverMode = _constants.DRIVER_MODE[1];
  }

  return _models.UserModel.updateOne({
    _id: ObjectId(userId)
  }, {
    $set: set
  });
}

async function findUserById(userId) {
  return _models.UserModel.findById({
    _id: ObjectId(userId)
  }, {
    password: 0,
    token: 0
  });
}

async function driverBadgeCounts(userId) {
  return await _models.ChatRecordModel.aggregate([{
    $match: {
      driverId: ObjectId(userId)
    }
  }, {
    $group: {
      _id: "$driverId",
      total: {
        $sum: {
          $toInt: "$passengertoDriverCount"
        }
      }
    }
  }]);
}

async function passengerBadgeCounts(userId) {
  return await _models.ChatRecordModel.aggregate([{
    $match: {
      passengerId: ObjectId(userId)
    }
  }, {
    $group: {
      _id: "$passengerId",
      total: {
        $sum: {
          $toInt: "$drivertoPassengerCount"
        }
      }
    }
  }]);
}

async function varifyed(contact) {
  return await _models.UserModel.updateOne({
    contactNumber: contact
  }, {
    $set: {
      isVerified: true
    }
  });
}
/**
 * find user using email id
 * @param {*} email
 */


async function findUser(email) {
  return await _models.UserModel.findOne({
    email: email
  });
}