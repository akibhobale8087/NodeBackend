"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendPushNotificationToMultipleDevices = void 0;

var fcm = _interopRequireWildcard(require("firebase-admin"));

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const SERVICE_CERT = "../config/fazApp.json"; // intitialize fcm

fcm.initializeApp({
  credential: fcm.credential.cert(path.resolve(__dirname, SERVICE_CERT))
}); // utility method to check tokens array

const isArray = tokens => tokens && tokens instanceof Array && typeof tokens[0] === "string"; // tokens


const tokens = ["cozxNrrJMuc:APA91bFNnm37FyFL-uaynD3golu9jJgz-3WtOgKZYXWW49i_9DSYB07din5RKW8G4LrZ537DEa8CCBtsQlek8pWQMfKny_-x92ae7cL0AKmbD9VrNjPXHIZoKmZw_wW2-wx5i0qX0kEK"]; // payload

const payload = {
  notification: {
    title: "Urgent action needed!",
    body: "Urgent action is needed to prevent your account from being disabled!",
    data: {
      minScore: 70,
      maxScore: 100
    }
  }
}; // Set the message as high priority and have it expire after 24 hours.

const options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
}; // send push notification to multiple devices or single device

const sendPushNotificationToMultipleDevices = (tokens, payload, options) => {
  if (!payload) throw new Error("You must provide a payload object");
  if (isArray(tokens)) fcm.messaging().sendToDevice(tokens, payload, options).then(function (response) {
    console.log("Successfully sent message:", response.results);
  }).catch(function (error) {
    console.log("Error sending message:", error);
  });else throw new Error("Invalid device token, tokens must be array of string!");
};

exports.sendPushNotificationToMultipleDevices = sendPushNotificationToMultipleDevices;