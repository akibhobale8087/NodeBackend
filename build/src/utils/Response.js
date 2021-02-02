"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Comman Response Format
 */
class Response {
  static sendResponse(isSuccess, result, message, statusCode) {
    var response = {};

    if (isSuccess) {
      response.success = true;
      response.statusCode = statusCode;
      response.payload = {
        message: message,
        data: result
      };
      response.error = {};
    } else {
      response.success = false;
      response.payload = {};
      response.error = message;
      response.statusCode = statusCode;
    }

    return response;
  }

}

var _default = Response;
exports.default = _default;