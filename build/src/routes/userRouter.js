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

router.get("/", _controllers.userController.ping);
/**
 * Passenger SignUp Route
 */

router.post("/signup", _controllers.userController.signup);
/**
 * Login User
 */

router.post("/login", _controllers.userController.loginUser);
/**
 *
 */

router.get("/logout", _auth.checkAuth, _controllers.userController.logout);
router.post("/productCreate", _auth.checkAuth, _controllers.userController.addproduct);
router.get("/productList", _auth.checkAuth, _controllers.userController.productList);
router.delete("/deleteProduct/:id", _auth.checkAuth, _controllers.userController.deleteProduct);
var _default = router;
exports.default = _default;