"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unLinkLocalImage = exports.uploadFile = exports.uploadToLocal = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _config = require("../config");

var _appRootPath = _interopRequireDefault(require("app-root-path"));

var aws = _interopRequireWildcard(require("aws-sdk"));

var _fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fsempty = require("fs-extra");

const s3 = new aws.S3({
  accessKeyId: _config.AWS.ACCESS_KEY,
  secretAccessKey: _config.AWS.SECRET_KEY
});
/**
 * Upload Document on Local uploads folder
 */

const getFilename = ({
  extension
}) => `${Date.now()}.${extension}`;

const diskStorage = _multer.default.diskStorage({
  destination: function (req, file, cb) {
    console.log(_appRootPath.default + "/uploads"); //cb(null, Root + "/src/uploads"); // normal use

    cb(null, _appRootPath.default + "/uploads"); // Deploy time
  },
  filename: (req, file, cb) => {
    cb(null, getFilename({
      extension: file.originalname.split(".").pop()
    }));
  }
});

const uploadToLocal = () => (0, _multer.default)({
  storage: diskStorage
});
/**
 * Upload Document on AWS S3 Bucket
 * @param {*} param0
 */


exports.uploadToLocal = uploadToLocal;

const generateKey = ({
  folder,
  driverId,
  extension
}) => `${folder}/${driverId}/${Date.now()}.${extension}`;

const uploadFile = ({
  folder,
  file,
  driverId,
  documentType
}) => {
  const Key = generateKey({
    folder,
    driverId,
    extension: file.originalname.split(".").pop().trim()
  });
  return s3.upload({
    Key,
    Body: _fs.default.createReadStream(file.path),
    Bucket: _config.AWS.S3.BUCKET,
    ACL: "public-read"
  }).promise();
};

exports.uploadFile = uploadFile;

const unLinkLocalImage = async (req, key) => {
  return await req.files[key].map(data => (0, _fs.unlink)(data.path, () => {}));
};

exports.unLinkLocalImage = unLinkLocalImage;