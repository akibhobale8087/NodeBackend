"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectMongo = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _debug = _interopRequireDefault(require("debug"));

var _fs = _interopRequireDefault(require("fs"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _debug.default)("app:mongo");

_mongoose.default.set("debug", _config.MONGO_CONFIG.DEBUG);
/**
 * MongoDB Connection Bridge
 */


const connectMongo = async () => {
  const connectionuri = _config.MONGO_CONFIG.URI;
  let sslOptions = {};

  if (_config.MONGO_CONFIG.SSl_CA && _config.MONGO_CONFIG.SSl_CERT && _config.MONGO_CONFIG.SSl_KEY) {
    const ca = [_fs.default.readFileSync(_config.MONGO_CONFIG.SSl_CA)];

    const cert = _fs.default.readFileSync(_config.MONGO_CONFIG.SSl_CERT);

    const key = _fs.default.readFileSync(_config.MONGO_CONFIG.SSl_KEY);

    sslOptions = {
      ssl: true,
      sslValidate: true,
      sslCA: ca,
      sslKey: key,
      sslCert: cert
    };
  }

  const options = { ...sslOptions,
    useUnifiedTopology: true,
    // autoReconnect: true,
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  };
  console.log("successfully connected to database.");
  await _mongoose.default.connect(connectionuri, options).catch(error => {
    console.log("ERROR connecting to mongo: " + error);
    process.exit(1);
  });
};

exports.connectMongo = connectMongo;