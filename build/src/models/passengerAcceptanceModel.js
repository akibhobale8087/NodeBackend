"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passengerAcceptancesModel = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passengerAcceptances = new _mongoose.default.Schema({
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  },
  passengerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  },
  status: {
    type: String,
    enum: []
  },
  amount: {
    type: Number
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const passengerAcceptancesModel = _mongoose.default.model("passengerAcceptances", passengerAcceptances);

exports.passengerAcceptancesModel = passengerAcceptancesModel;