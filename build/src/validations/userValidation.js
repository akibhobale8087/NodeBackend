"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validations = void 0;

var Joi = _interopRequireWildcard(require("joi"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Validations = {
  validateSignupPassenger,
  ValidateLogin,
  ValidateProduct
};
exports.Validations = Validations;

function validateSignupPassenger(user) {
  const schema = Joi.object({
    password: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required()
  });
  return schema.validate(user);
}
/**
 * Login Validation
 */


function ValidateLogin(user) {
  const schema = Joi.object({
    password: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required()
  });
  return schema.validate(user);
}

function ValidateProduct(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
    description: Joi.string()
  });
  return schema.validate(user);
}