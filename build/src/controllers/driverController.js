"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.driverController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _config = require("../config");

var _constants = require("../constants");

var _utils = require("../utils");

var _moment = _interopRequireDefault(require("moment"));

var _services = require("../services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const driverController = {
  updateLocation,
  driverNotificationList,
  sendNotificationToPassenger,
  driverRide,
  driverToPassenger,
  packageLists,
  selectPackage
};
exports.driverController = driverController;

async function updateLocation(req, res) {
  try {
    let {
      _id,
      role,
      contactNumber
    } = req.user;
    let {
      latitude,
      longitude
    } = JSON.parse(req.query.location);
    let userInfo = await _services.authService.findUser(contactNumber);

    if (!userInfo) {
      return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_CONTACT_NUMBER, _constants.StatusCode.BAD_REQUEST));
    }

    userInfo.location.coordinates[0] = longitude;
    userInfo.location.coordinates[1] = latitude;
    let locationUpdate = await _services.driverService.updateLocation(userInfo);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverNotificationList(req, res) {
  try {
    let {
      _id,
      contactNumber,
      role
    } = req.user;
    let {
      limit,
      page
    } = req.query;
    let driverNotification = await _services.driverService.driverNotifications(_id, parseInt(limit), parseInt(page));
    return res.send(_Response.default.sendResponse(true, driverNotification, _constants.CustomMessages.GET_ALL_RECORDS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function sendNotificationToPassenger(req, res) {
  try {
    let {
      contactNumber,
      _id,
      role
    } = req.user;
    let {
      passengerId,
      budget,
      distance,
      pickUpLocation,
      dropLocation,
      pickUpName,
      dropName,
      status
    } = req.body;
    req.body.pickUpLocation = {
      type: "Point",
      coordinates: [req.body.pickUpLocation.longitude, req.body.pickUpLocation.latitude]
    };
    req.body.dropLocation = {
      type: "Point",
      coordinates: [req.body.dropLocation.longitude, req.body.dropLocation.latitude]
    };
    await _services.passengerService.updateData(_id, passengerId);
    let passengerData = await _services.driverService.findUser(passengerId);

    if (!passengerData) {
      return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_FOUND, _constants.StatusCode.BAD_REQUEST));
    }

    let driverData = await _services.userService.driverInfo(_id); // console.log(driverData, "driverData&&&&&&&&&&&&&&&&");

    if (driverData.length < 1) {
      return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_FOUND, _constants.StatusCode.BAD_REQUEST));
    } // await passengerService.updateData(_id, passengerId);
    // const payload = {
    // 	notification: {
    // 		title: `${driverData[0].userName} ready to ride`,
    // 		body: `budget: ${budget}, carType: ${driverData[0].car.carType}`,
    // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
    // 		sound: "default",
    // 	},
    // 	data: {
    // 		type: `Driver Send to Passenger`,
    // 		driverName: `${driverData[0].userName}`,
    // 		budget: `${budget}`,
    // 		carType: `${driverData[0].car.carType}`,
    // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
    // 		dateTime: moment().utc().format(),
    // 	},
    // };
    // // let passengerToken = [];
    // // passengerToken.push(passengerData.deviceToken);
    // let tokens = [passengerData.deviceToken];
    // const options = { priority: "high", timeToLive: 60 * 60 * 24 };


    const payload = {
      include_player_ids: [passengerData.playerId],
      app_id: _config.ONESIGNAL_APP_ID,
      contents: {
        en: `${driverData[0].userName} ready to ride`
      },
      //android_channel_id: "e622a61b-46ee-44b3-a4a5-eb65da0f361f",
      headings: {
        en: `Driver Send to Passenger`
      },
      // to: userData.deviceToken,
      data: {
        type: `Driver Send to Passenger`,
        message: `budget: ${budget}, carType: ${driverData[0].car.carType}`,
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
    let response = await (0, _utils.sendNotification)(payload);
    let data = {
      type: _constants.PUSHNOTIFICATION_TYPE[0],
      passengerId: passengerData._id,
      pickUpLocation: req.body.pickUpLocation,
      dropLocation: req.body.dropLocation,
      userName: driverData[0].userName,
      carName: driverData[0].car.carName,
      budget: budget,
      status: status,
      dropName: dropName,
      pickUpName: pickUpName,
      driverId: driverData[0]._id,
      passengerId: passengerData._id,
      gender: driverData[0].gender,
      driverProfileImage: driverData[0].profileImage,
      // ? `${AWSBASEURL}/${driverData[0].role}/${driverData[0]._id}/${driverData[0].profileImage}`
      // : null,
      carType: driverData[0].car.carType,
      carFrontImage: driverData[0].car.carFrontImage,
      // ? `${AWSBASEURL}/${driverData[0].role}/${driverData[0]._id}/${driverData[0].car.carFrontImage}`
      // : null,
      carModel: driverData[0].car.carModel,
      distance: distance
    }; //	const tokens = passengerToken;
    // console.log(data, "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    // await sendPushNotificationToMultipleDevices(tokens, payload, options);

    await _services.passengerService.savePassengerPushNotificationData(data);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SENT_NOTIFICATION_TO_DRIVER, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverRide(req, res) {
  try {
    let {
      _id
    } = req.user;
    let result = await _services.driverService.driverRides(_id, parseInt(req.query.limit), parseInt(req.query.page));

    if (result.total > 0) {
      let userData = result.docs;

      for (let i = 0; i < userData.length; i++) {
        userData[i].driverId.profileImage = `${_config.AWSBASEURL}/${userData[i].driverId.role}/${userData[i].driverId._id}/${userData[i].driverId.profileImage}`;
        userData[i].passengerId.profileImage = `${_config.AWSBASEURL}/${userData[i].passengerId.role}/${userData[i].passengerId._id}/${userData[i].passengerId.profileImage}`;
      }
    }

    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_ALL_RECORDS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverToPassenger(req, res) {
  try {
    let {
      bookingId
    } = req.query;
    let {
      driverToPassengerRating,
      driverToPassengerComments,
      passengerId
    } = req.body;
    let result = await _services.driverService.driverToPassengerRating(bookingId, driverToPassengerRating, driverToPassengerComments);
    let passengerRating = await _services.userService.findUserById(passengerId);
    passengerRating.rating.ratingOutOf = passengerRating.rating.ratingOutOf + 1;
    passengerRating.rating.ratingCount = passengerRating.rating.ratingCount + driverToPassengerRating;
    let ratings = {
      ratingOutOf: passengerRating.rating.ratingOutOf,
      ratingCount: passengerRating.rating.ratingCount
    };
    let passengerData = {
      //	_id: driverId,
      _id: req.user._id,
      rating: ratings
    };
    let userCount = parseInt(passengerRating.rating.ratingOutOf) * parseInt(_config.rate);
    let rateResult = parseInt(passengerRating.rating.ratingCount) * parseInt(_config.rate) / parseInt(userCount);
    passengerData.rating.ratingTotal = Number(rateResult.toFixed(1));
    await _services.userService.updateUser(passengerData);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function packageLists(req, res) {
  try {
    let result = await _services.driverService.packageList(parseInt(req.query.limit), parseInt(req.query.page));
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function selectPackage(req, res) {
  try {
    // let { _id } = req.user;
    let {
      name,
      days,
      price,
      startDate,
      endDate,
      description,
      deiverId
    } = req.body;
    let result = await _services.driverService.selectPackage(req.body);
    let userInfo = {
      _id: deiverId,
      packageEndDate: endDate,
      packageDays: days
    };
    let userData = await _services.userService.updateUser(userInfo);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}