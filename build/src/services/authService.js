"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authService = void 0;

var _models = require("../models");

var bcrypt = _interopRequireWildcard(require("bcryptjs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const authService = {
  findUser,
  createUser
};
/**
 * Find User By Contact Number
 * @param {*} contactNumber
 */

exports.authService = authService;

async function findUser(email) {
  return _models.UserModel.findOne({
    email: email
  });
}
/**
 * Create password as bcrypt format and Save User
 * @param {*} userData
 */


async function createUser(userData) {
  userData.password = await generateHash(userData.password);
  const userObj = new _models.UserModel(userData);
  return userObj.save();
}
/**
 * 	Password as bcrypt format
 * @param {*} password
 */


async function generateHash(password) {
  return bcrypt.hashSync(password, 10);
}