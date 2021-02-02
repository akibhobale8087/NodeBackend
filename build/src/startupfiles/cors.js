"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cors = void 0;

/**
 * Cors Manage
 * Cross Origin Resorce Sharing
 * @param {*} app
 */
const cors = require("cors");

const Cors = app => {
  app.use(cors());
};

exports.Cors = Cors;