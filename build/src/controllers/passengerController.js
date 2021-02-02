"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passengerController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _config = require("../config");

var _constants = require("../constants");

var _services = require("../services");

var _utils = require("../utils");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passengerController = {
  sendNotificationToDriver,
  passengerBookCar,
  passengerNotificationList,
  // passengerCurrentRideOrder,
  previousRide,
  passengerToDriver
};
exports.passengerController = passengerController;

async function sendNotificationToDriver(req, res) {
  try {
    const {
      contactNumber
    } = req.user; // req.body.pickUpLocation = JSON.parse(req.body.pickUpLocation);
    // req.body.dropLocation = JSON.parse(req.body.dropLocation);

    const {
      pickUpLocation,
      budget,
      carType,
      carName,
      pickUpName,
      dropName,
      dropLocation,
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
    let promises = [];
    const userExits = await _services.authService.findUser(contactNumber);
    if (!userExits) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_CONTACT_NUMBER, _constants.StatusCode.BAD_REQUEST));
    let clearNotification = await _services.passengerService.clearDriverNotification(userExits._id);
    let updatePassengerDriver = await _services.passengerService.updatePassengerDrive(req.body, contactNumber);
    const drivers = await _services.passengerService.driverSearch(req.body.pickUpLocation); //console.log(drivers, "drivers List");

    if (drivers.length > 0) {
      //	const deviceToken = drivers.map((driver) => driver.deviceToken);
      const deviceToken = drivers.map(driver => driver.playerId);
      let data = {
        type: _constants.PUSHNOTIFICATION_TYPE[1],
        passengerId: userExits._id,
        userName: userExits.userName,
        budget: budget,
        pickUpName: pickUpName,
        dropName: dropName,
        status: status,
        pickUpLocation: req.body.pickUpLocation,
        dropLocation: req.body.dropLocation,
        gender: userExits.gender,
        passengerProfileImage: userExits.profileImage ? `${_config.AWSBASEURL}/${userExits.role}/${userExits._id}/${userExits.profileImage}` : null,
        carType: carType // carName: carName,

      };

      for (const driverData of drivers) {
        data.driverId = driverData._id;
        data.distance = driverData.calcDistance;
        let carInfo = await _services.carService.carInfo(driverData._id);
        data.carName = carInfo.carName;
        data.carModel = carInfo.carModel;
        promises.push(_services.passengerService.savePassengerPushNotificationData(data));
      } // console.log(promises, "promises List data ****************************");


      await Promise.all(promises); // Profile Image Default Add kr na hy yahapr
      // const payload = {
      // 	notification: {
      // 		title: `${userExits.userName} want to ride`,
      // 		body: `${pickUpName} to ${dropName} budget: ${budget}, carType: ${carType}`,
      // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
      // 		sound: "default",
      // 	},
      // 	data: {
      // 		type: `Passenger Send to Driver`,
      // 		userName: `${userExits.userName}`,
      // 		pickUpName: `${pickUpName}`,
      // 		dropName: `${dropName}`,
      // 		budget: `${budget}`,
      // 		carType: `${carType}`,
      // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
      // 		dateTime: moment().utc().format(),
      // 	},
      // };
      //const tokens = deviceToken;
      // const options = { priority: "high", timeToLive: 60 * 60 * 24 };
      // await sendPushNotificationToMultipleDevices(tokens, payload, options);

      const payload = {
        include_player_ids: deviceToken,
        app_id: _config.ONESIGNAL_APP_ID,
        contents: {
          en: `${userExits.userName} want to ride`
        },
        //android_channel_id: "e622a61b-46ee-44b3-a4a5-eb65da0f361f",
        headings: {
          en: `Passenger Send to Driver`
        },
        // to: userData.deviceToken,
        data: {
          type: `Passenger Send to Driver`,
          message: `${pickUpName} to ${dropName} budget: ${budget}, carType: ${carType}`,
          userName: `${userExits.userName}`,
          pickUpName: `${pickUpName}`,
          dropName: `${dropName}`,
          budget: `${budget}`,
          carType: `${carType}`,
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
      return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SENT_NOTIFICATION_TO_DRIVER, _constants.StatusCode.OK));
    } else {
      return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.NO_ANY_DRIVER, _constants.StatusCode.OK));
    }
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function passengerBookCar(req, res) {
  try {
    const {
      passengerId,
      driverId,
      budget
    } = req.body;
    const passengerData = await _services.passengerService.findPassenger(passengerId);
    if (!passengerData) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_CONTACT_NUMBER, _constants.StatusCode.BAD_REQUEST));
    const driverData = await _services.userService.driverInfo(driverId); // await passengerService.updateData(driverId, passengerId);

    if (driverData.length < 1) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_CONTACT_NUMBER, _constants.StatusCode.BAD_REQUEST));
    const pickup = (0, _utils.pick)(passengerData.userDrive[0], ["pickUpLocation", "pickUpName", "dropLocation", "dropName"]);
    const car = (0, _utils.pick)(driverData[0].car, ["carModel", "carType", "carNumber", "carName"]);
    const carBookingData = {
      passengerId: passengerData._id,
      driverId: driverData[0]._id,
      // carModel: driverData[0].car.carModel,
      // carType: driverData[0].car.carType,
      // carNumber: driverData[0].car.carNumber,
      // carName: driverData[0].car.carName,
      ...car,
      ...pickup,
      budget: budget,
      status: _constants.CARBOOKING_TYPE[0]
    }; // console.log(
    // 	passengerData.deviceToken,
    // 	"passenger Token",
    // 	driverData.deviceToken,
    // 	"Driver Token"
    // );

    const payload = {
      include_player_ids: [passengerData.playerId, driverData.playerId],
      app_id: _config.ONESIGNAL_APP_ID,
      contents: {
        en: `Your ride has been book.`
      },
      //android_channel_id: "e622a61b-46ee-44b3-a4a5-eb65da0f361f",
      headings: {
        en: `BOOK_CAR`
      },
      // to: userData.deviceToken,
      data: {
        type: `BOOK_CAR`,
        message: `Your ride has been book.`,
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
    // 		title: `BOOK_CAR`,
    // 		body: `Your ride has been book.`,
    // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
    // 		sound: "default",
    // 	},
    // 	data: {
    // 		type: `BOOK_CAR`,
    // 		click_action: "FLUTTER_NOTIFICATION_CLICK",
    // 		dateTime: moment().utc().format(),
    // 	},
    // };
    // let tokens = [passengerData.deviceToken, driverData.deviceToken];
    // const options = { priority: "high", timeToLive: 60 * 60 * 24 };
    // await sendPushNotificationToMultipleDevices(tokens, payload, options);

    let promises = [];
    promises.push(_services.passengerService.bookingSave(carBookingData));
    promises.push(_services.passengerService.clearPassengerDrive(passengerData.contactNumber));
    promises.push(_services.driverService.changeDriverMode(driverId));
    promises.push(_services.passengerService.clearDriverNotification(passengerData._id));
    await Promise.all(promises);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.RECORD_UPDATED, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function passengerNotificationList(req, res) {
  try {
    let {
      _id,
      contactNumber,
      role
    } = req.user;
    let {
      limit,
      page,
      gender,
      highToLow,
      lowToHigh,
      nearToYou
    } = req.query;
    let driverNotification = await _services.passengerService.passengerNotifications(_id, parseInt(req.query.limit), parseInt(req.query.page), req.query);
    return res.send(_Response.default.sendResponse(true, driverNotification, _constants.CustomMessages.GET_ALL_RECORDS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
} // async function passengerCurrentRideOrder(req, res) {
// 	try {
// 		let { _id } = req.user;
// 		let result = await passengerService.CurrentRideOrder(_id);
// 		if (result) {
// 			return res.send(
// 				Response.sendResponse(
// 					true,
// 					result,
// 					CustomMessages.GET_RECORD_SUCCESS,
// 					StatusCode.OK
// 				)
// 			);
// 		} else {
// 			return res.send(
// 				Response.sendResponse(
// 					true,
// 					null,
// 					CustomMessages.NOT_ANY_CURRENT_RIDE,
// 					StatusCode.OK
// 				)
// 			);
// 		}
// 	} catch (error) {
// 		return res.send(
// 			Response.sendResponse(
// 				false,
// 				null,
// 				error.message,
// 				StatusCode.INTERNAL_SERVER_ERROR
// 			)
// 		);
// 	}
// }


async function previousRide(req, res) {
  try {
    let {
      _id
    } = req.user;
    let result = await _services.passengerService.passengerPreviousRide(_id, parseInt(req.query.limit), parseInt(req.query.page));

    if (result.total > 0) {
      let userData = result.docs;

      for (let i = 0; i < userData.length; i++) {
        userData[i].driverId.profileImage = `${_config.AWSBASEURL}/${userData[i].driverId.role}/${userData[i].driverId._id}/${userData[i].driverId.profileImage}`;
        userData[i].passengerId.profileImage = `${_config.AWSBASEURL}/${userData[i].passengerId.role}/${userData[i].passengerId._id}/${userData[i].passengerId.profileImage}`;
      }
    } // console.log(result);


    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_ALL_RECORDS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function passengerToDriver(req, res) {
  try {
    let {
      bookingId
    } = req.query;
    let {
      passengerToDriverRating,
      passengerToDriverComments,
      driverId
    } = req.body;
    let result = await _services.passengerService.passengerToDriverRating(bookingId, passengerToDriverRating, passengerToDriverComments);
    let driverRating = await _services.userService.findUserById(driverId);
    driverRating.rating.ratingOutOf = driverRating.rating.ratingOutOf + 1;
    driverRating.rating.ratingCount = driverRating.rating.ratingCount + passengerToDriverRating;
    let ratings = {
      ratingOutOf: driverRating.rating.ratingOutOf,
      ratingCount: driverRating.rating.ratingCount
    };
    let driverData = {
      _id: driverId,
      rating: ratings
    };
    let userCount = parseInt(driverRating.rating.ratingOutOf) * parseInt(_config.rate);
    let rateResult = parseInt(driverRating.rating.ratingCount) * parseInt(_config.rate) / parseInt(userCount);
    driverData.rating.ratingTotal = Number(rateResult.toFixed(1));
    await _services.userService.updateUser(driverData);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}