"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

var _constants = require("../constants");

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

var _config = require("../config");

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
 * User DataBase Schema
 */

const user = new _mongoose.Schema({
  userName: {
    type: String
  },
  email: {
    type: String
  },
  profileImage: {
    type: String
  },
  password: {
    type: String
  },
  dob: {
    type: String,
    default: new Date()
  },
  gender: {
    type: String,
    enum: _constants.GENDER
  },
  role: {
    type: String,
    enum: _constants.ROLES
  },
  location: location,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  udid: {
    type: String
  },
  contactNumber: {
    type: String
  },
  badge_count: {
    type: Number,
    default: 0
  },
  rating: {
    ratingCount: {
      type: Number,
      default: 0
    },
    ratingOutOf: {
      type: Number,
      default: 0
    },
    ratingTotal: {
      type: Number,
      default: 0
    }
  },
  deviceType: {
    type: String,
    enum: _constants.DEVICE
  },
  deviceToken: {
    type: String
  },
  token: {
    type: String
  },
  totalRide: {
    type: Number,
    default: 0
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  signupAddress: {
    type: String
  },
  currentAddress: {
    type: String
  },
  driverMode: {
    type: String,
    enum: _constants.DRIVER_MODE,
    default: _constants.DRIVER_MODE[0]
  },
  userDrive: [],
  playerId: {
    type: String
  },
  packageEndDate: {
    type: Date
  },
  packageDays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true //  toObject: { virtuals: true },
  //  toJSON: { virtuals: true }

});
user.index({
  location: "2dsphere",
  _id: 1,
  email: 1
}); // user.index({ _id: 1, email: 1 });

user.plugin(_mongoosePaginate.default);

user.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    role: this.role,
    deviceType: this.deviceType,
    udid: this.udid,
    contactNumber: this.contactNumber
  }, _config.SECURITY.JWTKEY);
  return token;
};

user.methods.adminAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    role: this.role,
    email: this.email
  }, _config.SECURITY.JWTKEY);
  return token;
};

const UserModel = _mongoose.default.model(_constants.SCHEMA_NAMES.USER, user);

exports.UserModel = UserModel;