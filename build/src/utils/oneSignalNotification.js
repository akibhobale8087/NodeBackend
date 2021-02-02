"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotification = void 0;

var _config = require("../config");

const https = require("https");

const sendNotification = async function (data) {
  let headers = {
    authorization: `Basic ${_config.ONESIGNAL_REST_APIKEY}`,
    "Content-Type": "application/json; charset=utf-8"
  };
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      //return JSON.parse(data);
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  req.on("error", function (e) {
    console.log("ERROR:");
    console.log(e);
  });
  console.log(req);
  if (!data) console.log(e);
  req.write(JSON.stringify(data));
  req.end();
  return JSON.stringify(data);
};

exports.sendNotification = sendNotification;