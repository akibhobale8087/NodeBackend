"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _userModel = require("./userModel.js");

Object.keys(_userModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _userModel[key];
    }
  });
});

var _productModel = require("./productModel.js");

Object.keys(_productModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _productModel[key];
    }
  });
});