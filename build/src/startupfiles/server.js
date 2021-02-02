"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = void 0;

var _config = require("../config");

/**
 * Server Connection with Applicaton
 * @param {*} app
 */
const server = app => {
  const port = _config.SERVER.PORT;
  app.listen(port, _ => console.log(`server listening on port ${port}`));
};

exports.server = server;