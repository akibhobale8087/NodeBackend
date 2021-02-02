"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

var _auth = require("../middleware/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post("/adminlogin", _controllers.adminController.adminLogin);
router.post("/signUp", _controllers.adminController.adminSignup);
router.get("/passengerList", _auth.checkAuth, _controllers.adminController.allPassengerList);
router.get("/driverList", _auth.checkAuth, _controllers.adminController.driverList);
router.put("/ApproveDriver", _auth.checkAuth, _controllers.adminController.approvedDriver);
router.post("/sendNotification", _auth.checkAuth, _controllers.adminController.sendNotifications);
router.get("/driverInfo/:id", _auth.checkAuth, _controllers.adminController.driverInfo);
router.delete("/driver", _auth.checkAuth, _controllers.adminController.deleteDriver);
router.delete("/passenger", _auth.checkAuth, _controllers.adminController.deletePassenger);
router.get("/rideList", _auth.checkAuth, _controllers.adminController.rideList);
router.post("/package", _auth.checkAuth, _controllers.adminController.packageCreate);
router.get("/packageList", _auth.checkAuth, _controllers.adminController.packageList);
router.put("/packageupdate", _auth.checkAuth, _controllers.adminController.updatePackage);
router.get("/dashboard", _auth.checkAuth, _controllers.adminController.dashboard);
var _default = router;
exports.default = _default;