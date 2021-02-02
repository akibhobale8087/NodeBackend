"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _constants = require("../constants");

var _services = require("../services");

var _validations = require("../validations");

var bcrypt = _interopRequireWildcard(require("bcryptjs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userController = {
  ping,
  signup,
  loginUser,
  logout,
  addproduct,
  productList,
  deleteProduct
};
exports.userController = userController;

async function ping(req, res) {
  return res.send(_Response.default.sendResponse(true, "", _constants.CustomMessages.RECORD_CREATED, _constants.StatusCode.OK));
}

async function signup(req, res) {
  try {
    // validate request
    const {
      error
    } = _validations.Validations.validateSignupPassenger(req.body);

    if (error) return res.send(_Response.default.sendResponse(false, null, error.details[0].message, _constants.StatusCode.BAD_REQUEST));
    const {
      password,
      email
    } = req.body;
    const user = await _services.authService.findUser(email);
    if (user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.USER_EXIST, _constants.StatusCode.FOUND));
    const userSave = await _services.authService.createUser(req.body); //  success response

    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function loginUser(req, res) {
  try {
    const {
      error
    } = _validations.Validations.ValidateLogin(req.body);

    if (error) return res.send(_Response.default.sendResponse(false, null, error.details[0].message, _constants.StatusCode.BAD_REQUEST));
    const {
      email,
      password
    } = req.body;
    console.log(req.body, "Request Body");
    const user = await _services.authService.findUser(email);
    if (!user) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_EMAIL, _constants.StatusCode.BAD_REQUEST));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send(_Response.default.sendResponse(false, null, _constants.CustomMessages.INCORRECT_PASSWORD, _constants.StatusCode.BAD_REQUEST));
    const token = user.generateAuthToken();
    const userData = {
      _id: user._id,
      token
    };
    let updateUserData = await _services.userService.updateUser(userData);
    return res.send(_Response.default.sendResponse(true, updateUserData, _constants.CustomMessages.LOGIN_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function logout(req, res) {
  try {
    let {
      _id,
      role
    } = req.user;
    let result = await _services.userService.logoutUser(_id, role);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.LOGOUT_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function addproduct(req, res) {
  try {
    const {
      error
    } = _validations.Validations.ValidateProduct(req.body);

    if (error) return res.send(_Response.default.sendResponse(false, null, error.details[0].message, _constants.StatusCode.BAD_REQUEST));
    let {
      name,
      price,
      quantity,
      description
    } = req.body;
    let result = await _services.userService.addProduct(req.body);
    return res.send(_Response.default.sendResponse(true, null, _constants.CustomMessages.SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function productList(req, res) {
  try {
    let result = await _services.userService.allProduct();
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.GET_ALL_RECORDS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}

async function deleteProduct(req, res) {
  try {
    let id = req.params.id;
    console.log(id);
    let result = await _services.userService.deleteProduct(id);
    return res.send(_Response.default.sendResponse(true, result, _constants.CustomMessages.RECORD_DELETED_SUCCESS, _constants.StatusCode.OK));
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}