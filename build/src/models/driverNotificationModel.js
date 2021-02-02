"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DriverNotificationModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Location
 */
const location = {
  type: {
    type: String,
    enum: ["Point"] // 'location.type' must be 'Point'

  },
  coordinates: {
    type: [Number]
  }
};
/**
 * Driver Notification Collection
 * its an temparary table to manage drivers notification Data
 */

const driverNotificatios = new _mongoose.Schema({
  type: {
    type: String,
    enum: _constants.PUSHNOTIFICATION_TYPE
  },
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: _constants.SCHEMA_NAMES.USER
  },
  passengerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: _constants.SCHEMA_NAMES.USER
  },
  userName: {
    type: String
  },
  budget: {
    type: Number,
    default: 0
  },
  pickUpName: {
    type: String
  },
  dropName: {
    type: String
  },
  pickUpLocation: location,
  dropLocation: location,
  gender: {
    type: String,
    enum: _constants.GENDER
  },
  passengerProfileImage: {
    type: String
  },
  carType: {
    type: String,
    enum: _constants.CARTYPE
  },
  carName: {
    type: String
  },
  driverProfileImage: {
    type: String
  },
  carFrontImage: {
    type: String
  },
  carModel: {
    type: String
  },
  distance: {
    type: Number
  },
  status: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
driverNotificatios.index({
  pickUpLocation: "2dsphere"
});
driverNotificatios.plugin(_mongoosePaginate.default);

const DriverNotificationModel = _mongoose.default.model(_constants.SCHEMA_NAMES.DRIVERNOTIFICATION, driverNotificatios);

exports.DriverNotificationModel = DriverNotificationModel;