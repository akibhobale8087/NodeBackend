"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _constants = require("../constants");

var _config = require("../config");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Car Database Schema
 */
const car = new _mongoose.Schema({
  carModel: {
    type: String
  },
  carName: {
    type: String
  },
  carType: {
    type: String,
    enum: _constants.CARTYPE
  },
  drivingLicense: {
    type: String
  },
  carOwnership: {
    type: String
  },
  carNumber: {
    type: String
  },
  carFrontImage: {
    type: String
  },
  carInsurance: {
    type: String
  },
  carBackImage: {
    type: String
  },
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: _constants.SCHEMA_NAMES.USER
  }
}, {
  timestamps: true //	toObject: { virtuals: true },
  //	toJSON: { virtuals: true }

});
/**
 * Mongoose Virtual Function For Merge S3 URL and DrivingLicence Name
 */
// car.virtual("drivingLicenseUrl").get(function () {
// 	const bucketUrl = AWSBASEURL;
// 	const drivingLicense = this.drivingLicense;
// 	if (drivingLicense) {
// 		const drivingLicenseUrl = `${bucketUrl}/${drivingLicense}`;
// 		return drivingLicenseUrl;
// 	} else {
// 		return null;
// 	}
// });

/**
 * Mongoose Virtual Function For Merge S3 URL and CarOwnerShip Name
 */
// car.virtual("carOwnershipUrl").get(function () {
// 	const bucketUrl = AWSBASEURL;
// 	const carOwnership = this.carOwnership;
// 	if (carOwnership) {
// 		const carOwnershipUrl = `${bucketUrl}/${carOwnership}`;
// 		return carOwnershipUrl;
// 	} else {
// 		return null;
// 	}
// });

const CarModel = _mongoose.default.model(_constants.SCHEMA_NAMES.CAR, car);

exports.CarModel = CarModel;