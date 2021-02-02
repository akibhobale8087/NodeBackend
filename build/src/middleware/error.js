"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = void 0;

/**
 * Erro Response if something Wrong in Application
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const errorHandler = (err, req, res, next) => {
  console.log(err, "error");
  res.status(500).send({
    message: "Something went wrong"
  });
};

exports.errorHandler = errorHandler;