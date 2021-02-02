"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncMiddleware = void 0;

/**
 * MiddleWare Async Function
 * @param {*} fn
 */
const asyncMiddleware = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.asyncMiddleware = asyncMiddleware;