"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeNotFound = void 0;

/**
 * Root Not Match Function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const routeNotFound = (req, res, next) => {
  const error = new Error("Route not Match");
  error.status = 404;
  return res.status(error.status).send({
    message: error.message
  });
};

exports.routeNotFound = routeNotFound;