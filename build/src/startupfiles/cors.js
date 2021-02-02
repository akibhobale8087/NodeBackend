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
const Cors = app => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Accept,Content-Type,X-Requested-With, Autharization");

    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "POST,GET,PUT,PATCH,DELETE");
      return res.status(200).json({});
    }

    next();
  });
};

exports.Cors = Cors;