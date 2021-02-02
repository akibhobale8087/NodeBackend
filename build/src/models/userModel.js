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
 * User DataBase Schema
 */
const user = new _mongoose.Schema({
  userName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  contactNumber: {
    type: String
  },
  token: {
    type: String
  }
}, {
  timestamps: true
});
user.plugin(_mongoosePaginate.default);

user.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    email: this.email
  }, _config.SECURITY.JWTKEY);
  return token;
};

const UserModel = _mongoose.default.model(_constants.SCHEMA_NAMES.USER, user);

exports.UserModel = UserModel;