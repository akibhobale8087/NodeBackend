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

router.put("/filter-notification", _auth.checkAuth, _controllers.passengerController.sendNotificationToDriver);
router.post("/bookcar", _auth.checkAuth, _controllers.passengerController.passengerBookCar);
router.get("/passengernotification_list", _auth.checkAuth, _controllers.passengerController.passengerNotificationList); // router.get(
// 	"/rideCurrentOrder",
// 	checkAuth,
// 	passengerController.passengerCurrentRideOrder
// );

router.get("/rideList", _auth.checkAuth, _controllers.passengerController.previousRide);
router.put("/ratingComments", _auth.checkAuth, _controllers.passengerController.passengerToDriver);
var _default = router;
exports.default = _default;