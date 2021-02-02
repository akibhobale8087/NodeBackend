"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = void 0;

var Jwt = _interopRequireWildcard(require("jsonwebtoken"));

var _Response = _interopRequireDefault(require("../utils/Response"));

var _constants = require("../constants");

var _async_middleware = require("./async_middleware");

var _config = require("../config");

var _models = require("../models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Check Auth
 */
const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.send(_Response.default.sendResponse(false, "", _constants.CustomMessages.AUTH_TOKEN, _constants.StatusCode.BAD_REQUEST));
  const user = Jwt.verify(token, _config.SECURITY.JWTKEY);
  let userInfo = await _models.UserModel.findById(user._id);

  if (userInfo.token == "" || userInfo.token == undefined || userInfo.token == null) {
    return res.send(_Response.default.sendResponse(false, "", _constants.CustomMessages.AUTH_FAILED, _constants.StatusCode.BAD_REQUEST));
  }

  if (!user) return res.send(_Response.default.sendResponse(false, "", _constants.CustomMessages.AUTH_FAILED, _constants.StatusCode.BAD_REQUEST));
  if (!_constants.ROLES.includes(user.role)) return res.send(_Response.default.sendResponse(false, "", _constants.CustomMessages.AUTH_PERMISSION, _constants.StatusCode.FORBIDDEN));

  if (userInfo.role == "DRIVER") {
    if (!userInfo.isVerified) {
      return res.send(_Response.default.sendResponse(true, {
        isVerified: userInfo.isVerified
      }, _constants.CustomMessages.USER_NOT_VARIFIED, _constants.StatusCode.UNAUTHORIZED));
    }
  }

  req.user = user;
  next();
};

exports.checkAuth = checkAuth;