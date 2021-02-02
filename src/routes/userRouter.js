import express from "express";
import { userController } from "../controllers";

import { checkAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", userController.ping);

/**
 * Passenger SignUp Route
 */
router.post("/signup", userController.signup);

/**
 * Login User
 */

router.post("/login", userController.loginUser);

/**
 *
 */

router.get("/logout", checkAuth, userController.logout);

router.post("/productCreate", checkAuth, userController.addproduct);

router.get("/productList", checkAuth, userController.productList);

router.delete("/deleteProduct/:id", checkAuth, userController.deleteProduct);

export default router;
