"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validations = void 0;

var Joi = _interopRequireWildcard(require("joi"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Validations = {
  validateSignupDriver,
  validateSignupPassenger,
  ValidateLogin
};
/**
 * Driver Validate Function
 * @param {*} user
 */

exports.Validations = Validations;

function validateSignupDriver(user) {
  const schema = Joi.object({
    password: Joi.string().min(3).max(255).required(),
    userName: Joi.string().max(70).required(),
    signupAddress: Joi.string().required(),
    currentAddress: Joi.string().max(150).required(),
    contactNumber: Joi.string().required(),
    carName: Joi.string().required(),
    role: Joi.string().required(),
    gender: Joi.string(),
    location: Joi.object({
      longitude: Joi.number(),
      latitude: Joi.number()
    }),
    udid: Joi.string().required(),
    deviceType: Joi.string().required(),
    carModel: Joi.string().required(),
    carType: Joi.string().required(),
    carNumber: Joi.string().required()
  });
  return schema.validate(user);
}
/**
 * Passenger Validate Function
 * @param {*} user
 */


function validateSignupPassenger(user) {
  const schema = Joi.object({
    password: Joi.string().min(3).max(255).required(),
    contactNumber: Joi.string().min(8).max(15).required(),
    signupAddress: Joi.string().max(150).required(),
    currentAddress: Joi.string().max(150).required(),
    role: Joi.string().required(),
    location: Joi.object({
      longitude: Joi.number(),
      latitude: Joi.number()
    }),
    udid: Joi.string().required(),
    deviceType: Joi.string().required()
  });
  return schema.validate(user);
}
/**
 * Login Validation
 */


function ValidateLogin(user) {
  const schema = Joi.object({
    password: Joi.string().min(3).max(255).required(),
    contactNumber: Joi.string().min(8).max(15).required(),
    currentAddress: Joi.string().max(150).required(),
    deviceType: Joi.string().required(),
    deviceToken: Joi.string().required(),
    location: Joi.object({
      longitude: Joi.number(),
      latitude: Joi.number()
    }),
    playerId: Joi.string()
  });
  return schema.validate(user);
}