"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userService = void 0;

var _models = require("../models");

var _mongoose = require("mongoose");

const {
  ObjectId
} = _mongoose.Types;
const userService = {
  updateUser,
  deleteProduct,
  logoutUser,
  findUserById,
  findUser,
  addProduct,
  allProduct
};
/**
 * Update user Data
 * @param {*} userData
 */

exports.userService = userService;

async function updateUser(userData) {
  return await _models.UserModel.findOneAndUpdate({
    _id: ObjectId(userData._id)
  }, {
    $set: userData
  }, // { new: true }
  {
    fields: {
      password: 0
    },
    new: true
  });
}

async function logoutUser(userId, role) {
  let set = {
    deviceToken: null,
    token: null,
    isActive: false
  };

  if (role == ROLES[1]) {
    set.driverMode = DRIVER_MODE[1];
  }

  return _models.UserModel.updateOne({
    _id: ObjectId(userId)
  }, {
    $set: set
  });
}

async function findUserById(userId) {
  return _models.UserModel.findById({
    _id: ObjectId(userId)
  }, {
    password: 0,
    token: 0
  });
}
/**
 * find user using email id
 * @param {*} email
 */


async function findUser(email) {
  return await _models.UserModel.findOne({
    email: email
  });
}

async function addProduct(productInfo) {
  const product = new _models.ProductModel(productInfo);
  return await product.save();
}

async function allProduct() {
  return await _models.ProductModel.find();
}

async function deleteProduct(id) {
  return await _models.ProductModel.deleteOne({
    _id: id
  });
}