"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _constants = require("../constants");

var _services = require("../services");

var _validations = require("../validations");

var bcrypt = _interopRequireWildcard(require("bcryptjs"));

var _config = require("../config");

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userController = {
  ping,
  driverSignUp,
  passengerSignup,
  loginUser,
  driverProfile,
  passengerProfile,
  driverInformation,
  passengerInformation,
  userForgetPassword,
  postLocation,
  removeNotification,
  declineBooking,
  completeRide,
  logout,
  badgeCount,
  verify
};
exports.userController = userController;

async function ping(res) {
  return res.send(_Response.default.sendResponse(true, "", _constants.CustomMessages.RECORD_CREATED, _constants.StatusCode.OK));
}
/**
 * Driver SignUp
 * @param {*} req
 * @param {*} res
 */


async function driverSignUp(req, res) {
  try {
    req.body.location = JSON.parse(req.body.location);
    /*
    Add New Field in driver Profile
    1) number plate
    2) insurance
    3) car pictures
    */
    // extract data

    const {
      contactNumber,
      location: {
        latitude,
        longitude
      },
      carModel,
      carType,
      carNumber,
      carName
    } = req.body; // validate request

    const {
      error
    } = _validations.Validations.validateSignupDriver(req.body);

    if (error) return res.send(_Response.default.sendResponse(false, null, error.details[0].message, _constants.StatusCode.BAD_REQUEST));
    req.body.location = {
      type: "Point",
      coordinates: [req.body.location.longitude, req.body.location.latitude]
    }; // find existing driver

    const user = await _services.authService.findUser(contactNumber);
    if (user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_EXIST, _constants.StatusCode.FOUND)); // if not exists then save driver

    const userSave = await _services.authService.createUser(req.body); // upload driver license and car ownership docs

    const drivingLicenseData1 = await _services.authService.multifileCreate(req, "drivingLicense", userSave._id, userSave.role);
    const carOwnershipData1 = await _services.authService.multifileCreate(req, "carOwnership", userSave._id, userSave.role); // extract file names of docs

    const drivingLicense = await filesName(drivingLicenseData1.files.drivingLicense);
    const carOwnership = await filesName(carOwnershipData1.files.carOwnership); // gathered required info

    const carFrontImageData1 = await _services.authService.multifileCreate(req, "carfrontImages", userSave._id, userSave.role);
    const carFrontImage = await filesName(carFrontImageData1.files.carfrontImages); //	await unLinkLocalImage(req, "carfrontImages");

    const carBackImageData1 = await _services.authService.multifileCreate(req, "carbackImages", userSave._id, userSave.role);
    const carBackImage = await filesName(carBackImageData1.files.carbackImages); //await unLinkLocalImage(req, "carbackImages");

    const carInsuranceData1 = await _services.authService.multifileCreate(req, "carInsurances", userSave._id, userSave.role);
    const carInsurance = await filesName(carInsuranceData1.files.carInsurances); //	await unLinkLocalImage(req, "carInsurances");

    const carData = {
      drivingLicense,
      carOwnership,
      userId: userSave._id,
      carModel,
      carType,
      carNumber,
      carName,
      carFrontImage,
      carBackImage,
      carInsurance
    }; // carData.carInsurance = await filesName(
    // 	(
    // 		await authService.multifileCreate(
    // 			req,
    // 			"carInsurances",
    // 			userSave._id,
    // 			userSave.role
    // 		)
    // 	).files.carInsurances
    // );
    // await unLinkLocalImage(req, "carInsurances");
    // make car entry

    await _services.carService.createCar(carData); // success response

    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}
/**
 * Only devide filename
 * @param {*} driverData
 */


const filesName = driverData => driverData.map(file => file.key)[0].split("/").pop().trim();
/**
 * Passenger SignUp
 * @param {*} req
 * @param {*} res
 */


async function passengerSignup(req, res) {
  try {
    // validate request
    const {
      error
    } = _validations.Validations.validateSignupPassenger(req.body);

    if (error) return res.send(_Response.default.sendResponse(false, null, error.details[0].message, _constants.StatusCode.BAD_REQUEST)); // extract info

    const {
      password,
      signupAddress,
      currentAddress,
      role,
      udid,
      deviceType,
      contactNumber,
      location: {
        latitude,
        longitude
      }
    } = req.body;
    req.body = { ...req.body,
      ...{
        location: {
          type: "Point",
          coordinates: [req.body.location.longitude, req.body.location.latitude]
        }
      },
      ...{
        isVerified: true
      }
    }; // console.log(req.body, "Request BOdy");
    // fnd existing user

    const user = await _services.authService.findUser(contactNumber);
    if (user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_EXIST, _constants.StatusCode.FOUND));
    const userSave = await _services.authService.createUser(req.body); //  success response

    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function loginUser(req, res) {
  try {
    const {
      error
    } = _validations.Validations.ValidateLogin(req.body);

    if (error) return res.send(_Response.default.sendResponse(false, null, error.details[0].message, _constants.StatusCode.BAD_REQUEST));
    const {
      contactNumber,
      password,
      location: {
        latitude,
        longitude
      },
      playerId
    } = req.body;
    req.body.location = {
      type: "Point",
      coordinates: [req.body.location.longitude, req.body.location.latitude]
    };
    const user = await _services.authService.findUserData(contactNumber);
    if (!user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_CONTACT_NUMBER, _constants.StatusCode.BAD_REQUEST));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_PASSWORD, _constants.StatusCode.BAD_REQUEST));

    if (user.role === _constants.ROLES[1]) {
      if (!user.isVerified) return res.send(_Response.default.sendResponse(true, {
        isVerified: user.isVerified
      }, _constants.CustomMessages.USER_NOT_VARIFIED, _constants.StatusCode.UNAUTHORIZED));
    }

    if (user.isDelete) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_ACCOUNT_DELET, _constants.StatusCode.UNAUTHORIZED));
    const token = user.generateAuthToken();
    const data = (0, _utils.pick)(req.body, ["location", "deviceType", "deviceToken", "currentAddress", "playerId"]);
    const userData = {
      _id: user._id,
      token,
      ...data,
      isActive: true
    };
    if (user.role === _constants.ROLES[1]) userData.driverMode = "Online";
    let updateUserData = await _services.userService.updateUser(userData);

    if (user.role === _constants.ROLES[1]) {
      updateUserData = await _services.userService.driverInfo(user._id);
      updateUserData = updateUserData[0]; // Profile Image Default Add kr na hy yahapr
    }

    if (user.role === _constants.ROLES[2]) {
      updateUserData.profileImage = user.profileImage ? `${_config.AWSBASEURL}/${user.role}/${user._id}/${user.profileImage}` : null;
    }

    return res.send(_Response.default.sendResponse(true, updateUserData, _constants.CustomMessages.LOGIN_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}
/**
 * This is Put Method in pass id as req.params
 * @param {*} req
 * @param {*} res
 */


async function driverProfile(req, res) {
  try {
    // console.log(req.body, "Request Body");
    req.body.location = JSON.parse(req.body.location);
    const {
      birthDate,
      contactNumber,
      carNumber,
      carName,
      location: {
        latitude,
        longitude
      },
      signupAddress,
      currentAddress,
      userName,
      gender,
      email,
      profileS3,
      carfrontImageS3,
      carbackImageS3,
      carId
    } = req.body;
    const carinfo = {
      userId: req.params.id,
      carId,
      carNumber,
      carName
    };
    req.body.location = {
      type: "Point",
      coordinates: [req.body.location.longitude, req.body.location.latitude]
    }; //	req.body.dob = moment().toDate().toISOString(birthDate);

    req.body.dob = new Date(birthDate);
    const user = await _services.authService.findUser(contactNumber);
    if (!user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_EXIST, _constants.StatusCode.FOUND));
    if (!user.isVerified) return res.send(_Response.default.sendResponse(true, {
      isVerified: user.isVerified
    }, _constants.CustomMessages.USER_NOT_VARIFIED, _constants.StatusCode.UNAUTHORIZED));

    if (profileS3 == "true") {
      req.body.profileImage = await filesName((await _services.authService.multifileCreate(req, "profileImages", user._id, user.role)).files.profileImages);
    } else {
      await (0, _utils.unLinkLocalImage)(req, "profileImages");
    }

    if (carfrontImageS3) {
      carinfo.carFrontImage = await filesName((await _services.authService.multifileCreate(req, "carfrontImages", user._id, user.role)).files.carfrontImages);
    } else {
      await (0, _utils.unLinkLocalImage)(req, "carfrontImages");
    }

    if (carbackImageS3) {
      carinfo.carBackImage = await filesName((await _services.authService.multifileCreate(req, "carbackImages", user._id, user.role)).files.carbackImages);
    } else {
      await (0, _utils.unLinkLocalImage)(req, "carbackImages");
    }

    req.body._id = req.params.id;
    console.log(req.body, "Request Body day******************");
    const userUpdate = await _services.userService.updateUser(req.body);
    if (!userUpdate) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.FAILED_TO_UPDATE, _constants.StatusCode.NOT_MODIFIED));
    console.log(carinfo, "CAR INFO (((((((((((((((((((((((((((((((((((((((((");
    const carDataUpdate = await _services.carService.updateCar(carinfo); // await emptyDirctory();

    if (!carDataUpdate) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.FAILED_TO_UPDATE, _constants.StatusCode.NOT_MODIFIED));
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function passengerProfile(req, res) {
  try {
    req.body.location = JSON.parse(req.body.location);
    const {
      contactNumber,
      location: {
        latitude,
        longitude
      },
      birthDate,
      userName,
      email,
      gender,
      signupAddress,
      currentAddress,
      profileS3
    } = req.body;
    req.body.location = {
      type: "Point",
      coordinates: [req.body.location.longitude, req.body.location.latitude]
    };
    req.body.dob = new Date(birthDate);
    const user = await _services.authService.findUser(contactNumber);
    if (!user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_EXIST, _constants.StatusCode.FOUND));

    if (profileS3 == "true") {
      req.body.profileImage = await filesName((await _services.authService.multifileCreate(req, "profileImages", user._id, user.role)).files.profileImages);
    } else {
      await (0, _utils.unLinkLocalImage)(req, "profileImages");
    }

    req.body._id = req.params.id;
    const userUpdate = await _services.userService.updateUser(req.body);
    if (!userUpdate) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.FAILED_TO_UPDATE, _constants.StatusCode.NOT_MODIFIED));
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function driverInformation(req, res) {
  try {
    const userId = req.user._id;
    const driverData = await _services.userService.driverInfo(userId);
    if (!driverData) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_FOUND, _constants.StatusCode.NOT_FOUND));
    return res.send(_Response.default.sendResponse(true, driverData[0], _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function passengerInformation(req, res) {
  try {
    const {
      _id,
      contactNumber,
      role
    } = req.user;
    const passengerInformation = await _services.authService.findUser(contactNumber);
    if (!passengerInformation) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_FOUND, _constants.StatusCode.NOT_FOUND)); // Profile Image Default Add kr na hy yahapr

    passengerInformation.profileImage = passengerInformation.profileImage ? `${_config.AWSBASEURL}/${role}/${_id}/${passengerInformation.profileImage}` : null;
    return res.send(_Response.default.sendResponse(true, passengerInformation, _constants.CustomMessages.GET_RECORD_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}
/**
 *
 * forget Password or Update password
 * @param {udid,password,contactNumber} req
 * @param {*} res
 */


async function userForgetPassword(req, res) {
  try {
    const userValidate = await _services.authService.changePassword(req.body);
    if (!userValidate) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_NOT_FOUND, _constants.StatusCode.NOT_FOUND));
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.UPDATE_PASSWORD, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function postLocation(req, res) {
  try {} catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function removeNotification(req, res) {
  try {
    let {
      Id
    } = req.query;
    let result = await _services.userService.removeNotifications(Id);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_DELETED_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function declineBooking(req, res) {
  try {
    let {
      bookingId
    } = req.query;
    let result = await _services.userService.declinebookCab(bookingId);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.BOOKING_REJECTED_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function completeRide(req, res) {
  try {
    let {
      bookingId
    } = req.query;
    let result = await _services.userService.completeRides(bookingId);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RIDE_COMPLET_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function logout(req, res) {
  try {
    let {
      _id,
      role
    } = req.user;
    let result = await _services.userService.logoutUser(_id, role);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.LOGOUT_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function badgeCount(req, res) {
  try {
    let {
      _id,
      role
    } = req.user;

    if (role == _constants.ROLES[1]) {
      let total = 0;
      let result = await _services.userService.driverBadgeCounts(_id);

      if (result.length > 0) {
        total = result[0].total;
      }

      return res.send(_Response.default.sendResponse(true, total, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }

    if (role == _constants.ROLES[2]) {
      let total = 0;
      let result = await _services.userService.passengerBadgeCounts(_id);

      if (result.length > 0) {
        total = result[0].total;
      }

      return res.send(_Response.default.sendResponse(true, total, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
    }
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function verify(req, res) {
  try {
    let {
      contact
    } = req.body;
    let result = await _services.userService.varifyed(contact);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}