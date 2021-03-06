"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * User DataBase Schema
 */
const product = new _mongoose.Schema({
  name: {
    type: String
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});
product.plugin(_mongoosePaginate.default);

const ProductModel = _mongoose.default.model(_constants.SCHEMA_NAMES.PRODUCT, product);

exports.ProductModel = ProductModel;