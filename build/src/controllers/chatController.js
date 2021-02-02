"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chatController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _config = require("../config");

var _constants = require("../constants");

var _moment = _interopRequireDefault(require("moment"));

var _utils = require("../utils");

var _services = require("../services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chatController = {
  chatrecord,
  driverChatList,
  passengerChatList,
  commentsList,
  readMessage,
  chatNotification
};
exports.chatController = chatController;

async function chatrecord(req, res) {
  try {
    let {
      type,
      driverId,
      passengerId
    } = req.body;
    let result = await _services.chatService.chatData(driverId, passengerId);

    if (result) {
      if (type == _constants.PUSHNOTIFICATION_TYPE[0]) {
        // DriverToPassenger;
        req.body.drivertoPassengerCount = parseInt(result.drivertoPassengerCount) + 1;
        req.body.passengertoDriverCount = result.passengertoDriverCount;
      }

      if (type == _constants.PUSHNOTIFICATION_TYPE[1]) {
        // PassengerToDriver;
        req.body.drivertoPassengerCount = result.drivertoPassengerCount;
        req.body.passengertoDriverCount = parseInt(result.passengertoDriverCount) + 1;
      }

      delete req.body.type;
      await _services.chatService.updatebadge(req.body);
      return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
    } else {
      delete req.body.type;
      let resultData = await _services.chatService.createBadge(req.body);
      return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverChatList(req, res) {
  try {
    let {
      _id
    } = req.user;
    let data = {};
    let docs = [];
    let result = await _services.chatService.driverList(_id, parseInt(req.query.limit), parseInt(req.query.page));

    if (result.total > 0) {
      let userData = result.docs;

      for (let i = 0; i < userData.length; i++) {
        let bookInfo = await _services.chatService.bookInfo(_id, userData[i].passengerId);
        userData[i].passengerId.profileImage = userData[i].passengerId.profileImage ? `${_config.AWSBASEURL}/${userData[i].passengerId.role}/${userData[i].passengerId._id}/${userData[i].passengerId.profileImage}` : null;
        userData[i].driverId.profileImage = userData[i].driverId.profileImage ? `${_config.AWSBASEURL}/${userData[i].driverId.role}/${userData[i].driverId._id}/${userData[i].driverId.profileImage}` : null;
        let resultObject = {
          drivertoPassengerCount: userData[i].drivertoPassengerCount,
          passengertoDriverCount: userData[i].passengertoDriverCount,
          driverProfileImage: userData[i].driverId.profileImage,
          passengerProfileImage: userData[i].passengerId.profileImage,
          pickUpLocation: bookInfo[0].pickUpLocation,
          dropLocation: bookInfo[0].dropLocation,
          budget: bookInfo[0].budget,
          rating: bookInfo[0].rating,
          driverToPassengerRating: bookInfo[0].driverToPassengerRating,
          passengerToDriverRating: bookInfo[0].passengerToDriverRating,
          passengerId: bookInfo[0].passengerId,
          driverId: bookInfo[0].driverId,
          carModel: bookInfo[0].carModel,
          carType: bookInfo[0].carType,
          carNumber: bookInfo[0].carNumber,
          carName: bookInfo[0].carName,
          pickUpName: bookInfo[0].pickUpName,
          dropName: bookInfo[0].dropName,
          status: bookInfo[0].status,
          createdAt: bookInfo[0].createdAt,
          //driverToPassengerComments: bookInfo[0].driverToPassengerComments,
          driverContactNumber: userData[i].driverId.contactNumber,
          passengerContactNumber: userData[i].passengerId.contactNumber,
          driverUserName: userData[i].driverId.userName,
          passengerUserName: userData[i].passengerId.userName
        };
        docs.push(resultObject);
      }
    }

    docs.push({
      total: result.total,
      limit: result.limit,
      page: result.page,
      pages: result.pages
    });
    data.docs = docs;
    return res.send(_Response.default.sendResponse(true, data, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function passengerChatList(req, res) {
  try {
    let {
      _id
    } = req.user;
    let data = {};
    let docs = [];
    let result = await _services.chatService.passengerList(_id, parseInt(req.query.limit), parseInt(req.query.page));

    if (result.total > 0) {
      let userData = result.docs;

      for (let i = 0; i < userData.length; i++) {
        let bookInfo = await _services.chatService.bookInfo(userData[i].driverId, _id);
        userData[i].passengerId.profileImage = userData[i].passengerId.profileImage ? `${_config.AWSBASEURL}/${userData[i].passengerId.role}/${userData[i].passengerId._id}/${userData[i].passengerId.profileImage}` : null;
        userData[i].driverId.profileImage = userData[i].driverId.profileImage ? `${_config.AWSBASEURL}/${userData[i].driverId.role}/${userData[i].driverId._id}/${userData[i].driverId.profileImage}` : null; // userData[i].driverId.profileImage = userData[i].driverId.profileImage
        // 	? `${AWSBASEURL}/${userData[i].driverId.role}/${userData[i].driverId._id}/${userData[i].driverId.profileImage}`
        // 	: null;

        let resultObject = {
          drivertoPassengerCount: userData[i].drivertoPassengerCount,
          passengertoDriverCount: userData[i].passengertoDriverCount,
          driverProfileImage: userData[i].driverId.profileImage,
          passengerProfileImage: userData[i].passengerId.profileImage,
          pickUpLocation: bookInfo[0].pickUpLocation,
          dropLocation: bookInfo[0].dropLocation,
          budget: bookInfo[0].budget,
          rating: bookInfo[0].rating,
          driverToPassengerRating: bookInfo[0].driverToPassengerRating,
          passengerToDriverRating: bookInfo[0].passengerToDriverRating,
          passengerId: bookInfo[0].passengerId,
          driverId: bookInfo[0].driverId,
          carModel: bookInfo[0].carModel,
          carType: bookInfo[0].carType,
          carNumber: bookInfo[0].carNumber,
          carName: bookInfo[0].carName,
          pickUpName: bookInfo[0].pickUpName,
          dropName: bookInfo[0].dropName,
          status: bookInfo[0].status,
          createdAt: bookInfo[0].createdAt,
          //passengerToDriverComments: bookInfo[0].passengerToDriverComments,
          driverContactNumber: userData[i].driverId.contactNumber,
          passengerContactNumber: userData[i].passengerId.contactNumber,
          driverUserName: userData[i].driverId.userName,
          passengerUserName: userData[i].passengerId.userName
        };
        docs.push(resultObject);
      }
    }

    docs.push({
      total: result.total,
      limit: result.limit,
      page: result.page,
      pages: result.pages
    });
    data.docs = docs;
    return res.send(_Response.default.sendResponse(true, data, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function commentsList(req, res) {
  try {
    let {
      _id,
      role
    } = req.user;

    if (role == _constants.ROLES[1]) {
      let userData;
      let result = await _services.chatService.driverCommentsList(_id, parseInt(req.query.limit), parseInt(req.query.page));

      if (result.total > 0) {
        userData = result.docs;

        for (let i = 0; i < userData.length; i++) {
          //userData[i].passengerId.profileImage = i;
          userData[i].passengerId.profileImage = `${_config.AWSBASEURL}/${userData[i].passengerId.role}/${userData[i].passengerId._id}/${userData[i].passengerId.profileImage}`; // console.log(i);
          // console.log(userData[i].passengerId, "USER DATA");
        }
      }

      return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }

    if (role == _constants.ROLES[2]) {
      let results = await _services.chatService.passengerCommentsList(_id, parseInt(req.query.limit), parseInt(req.query.page));

      if (results.total > 0) {
        let userData = results.docs;

        for (let j = 0; j < userData.length; j++) {
          let image = "";
          image = `${_config.AWSBASEURL}/${userData[j].driverId.role}/${userData[j].driverId._id}/${userData[j].driverId.profileImage}`;
          userData[j].driverId.profileImage = image;
        }
      }

      return res.send(_Response.default.sendResponse(true, results, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function readMessage(req, res) {
  try {
    let {
      driverId,
      passengerId,
      type
    } = req.body;

    if (type == _constants.PUSHNOTIFICATION_TYPE[0]) {
      // Driver to passenger
      let result = await _services.chatService.readDriverToPassenger(driverId, passengerId);
      return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }

    if (type == _constants.PUSHNOTIFICATION_TYPE[1]) {
      // passenger to driver
      let result = await _services.chatService.readPassengerToDriver(driverId, passengerId);
      return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function chatNotification(req, res) {
  try {
    let {
      userId,
      message
    } = req.body;
    let userInfo = await _services.userService.findUserById(userId);
    const payload = {
      include_player_ids: [userInfo.playerId],
      app_id: _config.ONESIGNAL_APP_ID,
      contents: {
        en: `${message}`
      },
      //android_channel_id: "e622a61b-46ee-44b3-a4a5-eb65da0f361f",
      headings: {
        en: "CHAT_NOTIFICATION"
      },
      // to: userData.deviceToken,
      data: {
        type: `CHAT_NOTIFICATION`,
        message: `${message}`,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        dateTime: (0, _moment.default)().utc().format()
      },
      content_available: true,
      // priority: "high",
      sound: "default",
      ////////////////////////////
      IMPORTANCE: "URGENT",
      Lockscreen: "PUBLIC"
    };
    let response = await (0, _utils.sendNotification)(payload); // const payload = {
    // 	notification: {
    // 		title: `CHAT_NOTIFICATION`,
    // 		body: `${message}`,
    // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
    // 		sound: "default",
    // 	},
    // 	data: {
    // 		type: `CHAT_NOTIFICATION`,
    // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
    // 		dateTime: moment().utc().format(),
    // 	},
    // };
    // // let passengerToken = [];
    // // passengerToken.push(passengerData.deviceToken);
    // let tokens = [userInfo.deviceToken];
    // const options = { priority: "high", timeToLive: 60 * 60 * 24 };
    // await sendPushNotificationToMultipleDevices(tokens, payload, options);
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}