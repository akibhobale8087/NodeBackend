"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../middleware/auth");

var _controllers = require("../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get("/location", _auth.checkAuth, _controllers.driverController.updateLocation);
router.get("/drivernotification_list", _auth.checkAuth, _controllers.driverController.driverNotificationList);
router.post("/driverSendNotification", _auth.checkAuth, _controllers.driverController.sendNotificationToPassenger);
router.get("/driverRideList", _auth.checkAuth, _controllers.driverController.driverRide);
router.put("/ratingComments", _auth.checkAuth, _controllers.driverController.driverToPassenger);
router.get("/packageList", _controllers.driverController.packageLists);
router.post("/package", _controllers.driverController.selectPackage);
var _default = router;
exports.default = _default;