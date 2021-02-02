"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CARBOOKING_TYPE = exports.PUSHNOTIFICATION_TYPE = exports.DRIVER_MODE = exports.RANGE = exports.CARTYPE = exports.DEVICE = exports.GENDER = exports.ROLES = void 0;

/**
 * Enum Values
 */
const ROLES = ["ADMIN", "DRIVER", "PASSENGER"];
exports.ROLES = ROLES;
const GENDER = ["MALE", "FEMALE", "OTHER"];
exports.GENDER = GENDER;
const DEVICE = ["ANDROID", "IOS"];
exports.DEVICE = DEVICE;
const CARTYPE = ["ECONOMY", "PRIME", "XL"];
exports.CARTYPE = CARTYPE;
const RANGE = ["HighToLow", "LowToHigh"];
exports.RANGE = RANGE;
const DRIVER_MODE = ["Online", "Offline", "OnDrive"];
exports.DRIVER_MODE = DRIVER_MODE;
const PUSHNOTIFICATION_TYPE = ["DriverToPassenger", "PassengerToDriver"];
exports.PUSHNOTIFICATION_TYPE = PUSHNOTIFICATION_TYPE;
const CARBOOKING_TYPE = ["ACTIVE", "REJECTED", "COMPLETED"];
exports.CARBOOKING_TYPE = CARBOOKING_TYPE;