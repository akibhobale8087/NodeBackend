"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _constants = require("../constants");

var _services = require("../services");

var _utils = require("../utils");

var bcrypt = _interopRequireWildcard(require("bcryptjs"));

var _config = require("../config");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const adminController = {
  adminSignup,
  adminLogin,
  allPassengerList,
  driverList,
  approvedDriver,
  deleteDriver,
  deletePassenger,
  rideList,
  packageCreate,
  packageList,
  updatePackage,
  dashboard,
  sendNotifications,
  driverInfo
};
exports.adminController = adminController;

async function adminSignup(req, res) {
  try {
    let adminSignup = {
      role: _constants.ROLES[0],
      email: "FazAdmin@gmail.com",
      password: "admin@1234",
      userName: "admin",
      isVerified: true
    };
    let result = await _services.authService.createUser(adminSignup);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function adminLogin(req, res) {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await _services.userService.findUser(email);
    if (!user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_EMAILID, _constants.StatusCode.BAD_REQUEST));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_PASSWORD, _constants.StatusCode.BAD_REQUEST));
    const token = user.adminAuthToken();
    const userData = {
      id: user._id,
      isActive: true,
      token
    };
    let updateUserData = await _services.adminService.updateUser(userData);
    let userInfo = await _services.adminService.findUser(email);
    return res.send(_Response.default.sendResponse(true, userInfo, _constants.CustomMessages.LOGIN_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function allPassengerList(req, res) {
  try {
    let result = await _services.adminService.passengerList(parseInt(req.query.limit), parseInt(req.query.page), req.query); // if (result.total > 0) {
    // 	let passengers = result.docs;
    // 	for (let i = 0; i <= result.total; i++) {
    // 		passengers[i].profileImage = passengers[i].profileImage
    // 			? `${AWSBASEURL}/${passengers[i].role}/${passengers[i]._id}/${passengers[i].profileImage}`
    // 			: null;
    // 	}
    // }
    // console.log(result, "Passenger List DATA");

    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK)); // }
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverList(req, res) {
  try {
    let data = [];
    let drivers;
    let result = await _services.adminService.driverList(parseInt(req.query.limit), parseInt(req.query.page), req.query); // if (result.total > 0) {
    // 	drivers = result.docs;
    // 	for (let j = 0; j < drivers.length; j++) {
    // 		let carData = await adminService.carInfo(drivers[j]._id);
    // 		//	let driverData = {...}
    // 		data.push(...drivers[j], ...carData);
    // 		drivers[j].carName = carData.carName;
    // 		console.log(carData, "Drivers dTaaat");
    // 	}
    // 	console.log(drivers, "Drivers");
    // }
    //console.log(result, "result data");

    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function approvedDriver(req, res) {
  try {
    let {
      driverId
    } = req.query;
    let result = await _services.adminService.updateDriver(driverId);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function rideList(req, res) {
  try {
    let result = await _services.adminService.rideLists(parseInt(req.query.limit), parseInt(req.query.page));
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function deleteDriver(req, res) {
  try {
    let {
      _id
    } = req.query;
    let result = await _services.adminService.deleteDriver(_id); // if (result.total > 0) {

    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_DELETED_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function deletePassenger(req, res) {
  try {
    let {
      _id
    } = req.query;
    let result = await _services.adminService.deletePassenger(_id); // if (result.total > 0) {

    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_DELETED_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function sendNotifications(req, res) {
  try {
    let {
      title,
      message,
      type
    } = req.body;
    let result;

    if (type == "ALL") {
      result = await _services.adminService.getAllUsers();
    }

    if (type == _constants.ROLES[1]) {
      // "LAWYER"
      result = await _services.adminService.getAllDrivers();
    }

    if (type == _constants.ROLES[2]) {
      // "CLIENT"
      result = await _services.adminService.getAllPassengers();
    }

    let playedIds = result.map(player => player.playerId);
    const payload = {
      include_player_ids: playedIds,
      app_id: _config.ONESIGNAL_APP_ID,
      contents: {
        en: message
      },
      //android_channel_id: "e622a61b-46ee-44b3-a4a5-eb65da0f361f",
      // headings: { en: "Comments and Rating for You " },
      headings: {
        en: title
      },
      data: {
        type: `OFFER`,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        body: message //dateTime: moment().utc().format(),

      },
      content_available: true,
      // priority: "high",
      sound: "default",
      ////////////////////////////
      IMPORTANCE: "URGENT",
      Lockscreen: "PUBLIC"
    };
    let response = await (0, _utils.sendNotification)(payload);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function packageCreate(req, res) {
  try {
    let {
      name,
      days,
      price,
      description
    } = req.body;
    let result = await _services.adminService.packages(req.body);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function packageList(req, res) {
  try {
    let result = await _services.adminService.packageList(parseInt(req.query.limit), parseInt(req.query.page));
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function updatePackage(req, res) {
  try {
    let {
      packageId
    } = req.query;
    let result = await _services.adminService.updatePackage(packageId, req.body);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function dashboard(req, res) {
  try {
    let result = await _services.adminService.dashboardData();
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverInfo(req, res) {
  try {
    let id = req.params.id;
    console.log(id, "test DEMO");
    let result = await _services.adminService.driverInformation(id);
    console.log(result, "^^^^^^^^^^^^^^^^^^^^^");
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}