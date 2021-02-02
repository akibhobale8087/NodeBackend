"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cors = require("./cors.js");

Object.keys(_cors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cors[key];
    }
  });
});

var _db = require("./db.js");

Object.keys(_db).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _db[key];
    }
  });
});

var _server = require("./server.js");

Object.keys(_server).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _server[key];
    }
  });
});

var _routes = require("./routes.js");

Object.keys(_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _routes[key];
    }
  });
});