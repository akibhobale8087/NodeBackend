"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carService = void 0;

var _models = require("../models");

var _mongoose = require("mongoose");

const {
  ObjectId
} = _mongoose.Types;
const carService = {
  createCar,
  updateCar,
  carInfo
};
/**
 * Save Car Information
 * @param {*} data
 */

exports.carService = carService;

async function createCar(data) {
  let carData = new _models.CarModel(data);
  return carData.save();
}
/**
 *
 * @param {*} carInfo
 */


async function updateCar(carInfo) {
  const filter = {
    _id: ObjectId(carInfo.carId),
    userId: ObjectId(carInfo.userId)
  };
  const update = {
    $set: carInfo
  }; // return await CarModel.findOneAndUpdate(filter, update, {
  // 	new: true,
  // });

  return await _models.CarModel.updateOne(filter, update);
}

async function carInfo(userId) {
  return await _models.CarModel.findOne({
    userId: ObjectId(userId)
  });
}