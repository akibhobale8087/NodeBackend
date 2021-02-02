"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubscriptionPackageModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _constants = require("../constants");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const subscriptionPackage = new _mongoose.Schema({
  amount: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  is_Active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const SubscriptionPackageModel = _mongoose.default.model(_constants.SCHEMA_NAMES.SUBSCRIPTIONPACKAGE, subscriptionPackage);

exports.SubscriptionPackageModel = SubscriptionPackageModel;