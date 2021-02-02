"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ONESIGNAL_APP_ID = exports.ONESIGNAL_REST_APIKEY = exports.rate = exports.CAR_DEFAULT_BACK_IMAGE_URL = exports.CAR_DEFAULT_FRONT_IMAGE_URL = exports.PROFILE_DEFAULT_IMAGE_URL = exports.DISTANCE = exports.AWSBASEURL = exports.AWS = exports.SECURITY = exports.SERVER = exports.BASE_URL = exports.MONGO_CONFIG = void 0;
const MONGO_CONFIG = {
  URI: "mongodb+srv://akib:akib@123@fazapp.qbqka.mongodb.net/<dbname>?retryWrites=true&w=majority",
  //"mongodb+srv://akshay1:test@cluster0-l4oye.mongodb.net/test?retryWrites=true&w=majority",
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
const AWS = {
  ACCESS_KEY: "AKIA5BVQZBFBU4L2RC62",
  //"AKIAYA26B7HXTR2XWZ22",
  SECRET_KEY: "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",
  //"BZJO6OW20fpcoiiqQ/KG/dO4HVkXijcWSav7Ibw5",
  REGION: "us-east-2",
  S3: {
    BUCKET: "fazapp1"
  }
};
exports.AWS = AWS;
const AWSBASEURL = `https://${AWS.S3.BUCKET}.s3.${AWS.REGION}.amazonaws.com`;
exports.AWSBASEURL = AWSBASEURL;
const DISTANCE = 20000; // Passenger Search In 20000 mitter is 20 KM Drives

exports.DISTANCE = DISTANCE;
const PROFILE_DEFAULT_IMAGE_URL = ``;
exports.PROFILE_DEFAULT_IMAGE_URL = PROFILE_DEFAULT_IMAGE_URL;
const CAR_DEFAULT_FRONT_IMAGE_URL = ``;
exports.CAR_DEFAULT_FRONT_IMAGE_URL = CAR_DEFAULT_FRONT_IMAGE_URL;
const CAR_DEFAULT_BACK_IMAGE_URL = ``;
exports.CAR_DEFAULT_BACK_IMAGE_URL = CAR_DEFAULT_BACK_IMAGE_URL;
const rate = 5; //export const ONESIGNAL_REST_APIKEY =
// "YTdkZTIzZDItMThjYS00MzM3LWJjNWUtMTNjMzZmMzM0ZGQx";
//export const ONESIGNAL_APP_ID = "545dbb20-f22d-453f-99a5-82238548f3ba"; Lawyer App id

exports.rate = rate;
const ONESIGNAL_REST_APIKEY = "OTcxMmY3YTMtZWM0NC00OTFlLWJmNWItY2JlZWI0ZDE3YTFj";
exports.ONESIGNAL_REST_APIKEY = ONESIGNAL_REST_APIKEY;
const ONESIGNAL_APP_ID = "097603e8-5640-4931-b3a5-1736d329d51d";
exports.ONESIGNAL_APP_ID = ONESIGNAL_APP_ID;