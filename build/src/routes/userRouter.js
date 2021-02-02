"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

var _utils = require("../utils");

var _auth = require("../middleware/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const upload = (0, _utils.uploadToLocal)();

const router = _express.default.Router();

router.get("/", _controllers.userController.ping);
/**
 *Driver SignUp Route
 */

router.post("/signup-driver", upload.fields([{
  name: "drivingLicense",
  maxCount: 1
}, {
  name: "carOwnership",
  maxCount: 1
}, {
  name: "carfrontImages",
  maxCount: 1
}, {
  name: "carbackImages",
  maxCount: 1
}, {
  name: "carInsurances",
  maxCount: 1
}]), _controllers.userController.driverSignUp);
/**
 * Passenger SignUp Route
 */

router.post("/signup-passenger", _controllers.userController.passengerSignup);
/**
 * Login User
 */

router.post("/login", _controllers.userController.loginUser);
/**
 * Update Driver Profile Driver is pass in params
 */

router.put("/driverProfile/:id", _auth.checkAuth, upload.fields([{
  name: "profileImages",
  maxCount: 1
}, {
  name: "carfrontImages",
  maxCount: 1
}, {
  name: "carbackImages",
  maxCount: 1
}]), _controllers.userController.driverProfile);
/**
 * Passemger Profile update
 */

router.put("/passengerProfile/:id", _auth.checkAuth, upload.fields([{
  name: "profileImages",
  maxCount: 1
}]), _controllers.userController.passengerProfile);
/**
 * Driver Information with his vehical
 */

router.get("/driver", _auth.checkAuth, _controllers.userController.driverInformation);
/**
 * Passenger Information
 */

router.get("/passenger", _auth.checkAuth, _controllers.userController.passengerInformation);
/**
 * User forget password
 */

router.put("/forget-password", _controllers.userController.userForgetPassword);
/**
 *
 */

router.put("/passenger/:id", _auth.checkAuth, _controllers.userController.postLocation);
router.get("/search", _auth.checkAuth, _controllers.searchController.search);
router.get("/removeNotification", _auth.checkAuth, _controllers.userController.removeNotification);
router.put("/declineBooking", _auth.checkAuth, _controllers.userController.declineBooking);
router.put("/completeRide", _auth.checkAuth, _controllers.userController.completeRide);
router.get("/logout", _auth.checkAuth, _controllers.userController.logout);
router.get("/badge", _auth.checkAuth, _controllers.userController.badgeCount);
router.post("/verify", _controllers.userController.verify);
var _default = router;
exports.default = _default;