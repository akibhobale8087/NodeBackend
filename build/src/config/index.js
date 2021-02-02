"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SECURITY = exports.SERVER = exports.BASE_URL = exports.MONGO_CONFIG = void 0;
const MONGO_CONFIG = {
  URI: "mongodb://localhost:27017/TASK",
  DEBUG: "",
  SSl_CA: "",
  SSl_CERT: "",
  SSl_KEY: ""
};
exports.MONGO_CONFIG = MONGO_CONFIG;
const BASE_URL = "/api/v1";
exports.BASE_URL = BASE_URL;
const SERVER = {
  PORT: process.env.PORT || 8000
};
exports.SERVER = SERVER;
const SECURITY = {
  JWTKEY: "TEST123"
};
exports.SECURITY = SECURITY;