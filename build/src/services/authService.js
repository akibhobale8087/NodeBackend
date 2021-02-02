"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authService = void 0;

var _models = require("../models");

var bcrypt = _interopRequireWildcard(require("bcryptjs"));

var _utils = require("../utils");

var _fs = require("fs");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const authService = {
  findUser,
  findUserData,
  createUser,
  multifileCreate,
  changePassword
};
/**
 * Find User By Contact Number
 * @param {*} contactNumber
 */

exports.authService = authService;

async function findUser(contactNumber) {
  return _models.UserModel.findOne({
    contactNumber: contactNumber
  }, {
    password: 0
  });
}

async function findUserData(contactNumber) {
  return _models.UserModel.findOne({
    contactNumber: contactNumber
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
/**
 * Upload Driver SignUp Document
 * Example :- DrivingLicense and CarOwnership
 * @param {*} req
 * @param {*} key
 * @param {*} id
 */


async function multifileCreate(req, key, id, folderName) {
  let promises = [];
  req.files[key].map(async file => {
    promises.push((0, _utils.uploadFile)({
      folder: folderName,
      file,
      driverId: id
    }));
  });
  req.files[key].map(data => (0, _fs.unlink)(data.path, () => {}));
  req.files[key] = await Promise.all(promises).then(res => res);
  return req;
}
/**
 *
 * @param {udid,contactNumber} user
 */


async function changePassword(userData) {
  userData.password = await generateHash(userData.password);
  let filter = {
    udid: userData.udid,
    contactNumber: userData.contactNumber
  };
  let update = {
    $set: {
      password: userData.password
    }
  };
  return await _models.UserModel.findOneAndUpdate(filter, update, {
    fields: {
      password: 0
    },
    new: true
  });
}