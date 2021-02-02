"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarBookingModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

var _constants = require("../constants");

var _joi = require("joi");

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
 * Passenger Booking Database Schema
 */

const carBooking = new _mongoose.Schema({
  carName: {
    type: String
  },
  carModel: {
    type: String
  },
  carType: {
    type: String,
    enum: _constants.CARTYPE
  },
  carNumber: {
    type: String
  },
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: _constants.SCHEMA_NAMES.USER
  },
  passengerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: _constants.SCHEMA_NAMES.USER
  },
  budget: {
    type: Number,
    default: 0
  },
  review: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  pickUpLocation: location,
  pickUpName: {
    type: String
  },
  dropLocation: location,
  dropName: {
    type: String
  },
  status: {
    type: String,
    enum: _constants.CARBOOKING_TYPE
  },
  driverToPassengerRating: {
    type: Number,
    default: 0
  },
  passengerToDriverRating: {
    type: Number,
    default: 0
  },
  driverToPassengerComments: {
    type: String
  },
  passengerToDriverComments: {
    type: String
  }
}, {
  timestamps: true
});
carBooking.plugin(_mongoosePaginate.default);

const CarBookingModel = _mongoose.default.model(_constants.SCHEMA_NAMES.CARBOOKING, carBooking);

exports.CarBookingModel = CarBookingModel;