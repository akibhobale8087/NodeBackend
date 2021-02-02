"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chatService = void 0;

var _models = require("../models");

var _mongoose = require("mongoose");

const {
  ObjectId
} = _mongoose.Types;
const chatService = {
  chatData,
  updatebadge,
  createBadge,
  driverList,
  passengerList,
  driverCommentsList,
  passengerCommentsList,
  readDriverToPassenger,
  readPassengerToDriver,
  bookInfo
};
exports.chatService = chatService;

async function chatData(driverId, passengerId) {
  return await _models.ChatRecordModel.findOne({
    driverId: driverId,
    passengerId: passengerId
  });
}

async function updatebadge(userData) {
  return await _models.ChatRecordModel.updateOne({
    driverId: userData.driverId,
    passengerId: userData.passengerId
  }, {
    $set: { ...userData
    }
  });
}

async function createBadge(userData) {
  let chatRecord = new _models.ChatRecordModel(userData);
  return chatRecord.save();
}

async function driverList(userId, limit, page) {
  const filters = {
    // type: PUSHNOTIFICATION_TYPE[0],
    driverId: userId
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
  return await _models.ChatRecordModel.paginate(filters, options);
}

async function passengerList(userId, limit, page) {
  const filters = {
    // type: PUSHNOTIFICATION_TYPE[0],
    passengerId: userId
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
  return await _models.ChatRecordModel.paginate(filters, options);
}

async function driverCommentsList(userId, limit, page) {
  const filters = {
    // type: PUSHNOTIFICATION_TYPE[0],
    driverId: userId
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
    }],
    sort: {
      createdAt: -1
    }
  };
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.CarBookingModel.paginate(filters, options);
}

async function passengerCommentsList(userId, limit, page) {
  const filters = {
    // type: PUSHNOTIFICATION_TYPE[0],
    passengerId: userId
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
    } // {
    // 	select: {
    // 		_id: 1,
    // 		driverId: 1,
    // 		driverToPassengerRating: 1,
    // 		driverToPassengerComments: 1,
    // 	},
    // },
    ],
    sort: {
      createdAt: -1
    }
  };
  page ? options.page = Number(page) : options.page = 1;
  limit ? options.limit = Number(limit) : options.limit = 10;
  return await _models.CarBookingModel.paginate(filters, options);
}

async function readDriverToPassenger(driverId, passengerId) {
  return await _models.ChatRecordModel.updateOne({
    driverId: driverId,
    passengerId: passengerId
  }, {
    $set: {
      drivertoPassengerCount: 0
    }
  });
}

async function readPassengerToDriver(driverId, passengerId) {
  return await _models.ChatRecordModel.updateOne({
    driverId: driverId,
    passengerId: passengerId
  }, {
    $set: {
      passengertoDriverCount: 0
    }
  });
}

async function bookInfo(driverId, passengerId) {
  return await _models.CarBookingModel.find({
    driverId: driverId,
    passengerId: passengerId
  }).sort({
    createdAt: -1
  }).limit(1);
}