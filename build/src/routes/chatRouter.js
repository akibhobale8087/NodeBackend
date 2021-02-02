"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../middleware/auth");

var _controllers = require("../controllers");

var _services = require("../services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post("/", _auth.checkAuth, _controllers.chatController.chatrecord);
router.get("/passengerList", _auth.checkAuth, _controllers.chatController.driverChatList);
router.get("/driverList", _auth.checkAuth, _controllers.chatController.passengerChatList);
router.get("/commentsList", _auth.checkAuth, _controllers.chatController.commentsList);
router.put("/unreadmessage", _auth.checkAuth, _controllers.chatController.readMessage);
router.post("/chatNotification", _auth.checkAuth, _controllers.chatController.chatNotification);
var _default = router;
exports.default = _default;