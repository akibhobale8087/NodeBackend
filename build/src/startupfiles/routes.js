"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = void 0;

var _routeNotMatch = require("../routes/routeNotMatch");

var _userRouter = _interopRequireDefault(require("../routes/userRouter"));

var _morgan = _interopRequireDefault(require("morgan"));

var _config = require("../config");

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manage Route
 * @param {*} app
 */
const Routes = app => {
  app.use(_express.default.json());
  app.use(_express.default.urlencoded({
    extended: false
  }));
  app.use(_config.BASE_URL + "/uploads", _express.default.static("uploads"));
  app.use((0, _morgan.default)("dev"));
  app.use(_config.BASE_URL + "/user", _userRouter.default);
  app.use("*", _routeNotMatch.routeNotFound);
};

exports.Routes = Routes;