import * as Jwt from "jsonwebtoken";
import Response from "../utils/Response";
import { CustomMessages, StatusCode, ROLES } from "../constants";
import { SECURITY } from "../config";
import { UserModel } from "../models";
/**
 * Check Auth
 */
export const checkAuth = async (req, res, next) => {
	const token = req.headers.authorization;
	if (!token)
		return res.send(
			Response.sendResponse(
				false,
				"",
				CustomMessages.AUTH_TOKEN,
				StatusCode.BAD_REQUEST
			)
		);
	const user = Jwt.verify(token, SECURITY.JWTKEY);
	let userInfo = await UserModel.findById(user._id);
	if (
		userInfo.token == "" ||
		userInfo.token == undefined ||
		userInfo.token == null
	) {
		return res.send(
			Response.sendResponse(
				false,
				"",
				CustomMessages.AUTH_FAILED,
				StatusCode.BAD_REQUEST
			)
		);
	}

	if (!user)
		return res.send(
			Response.sendResponse(
				false,
				"",
				CustomMessages.AUTH_FAILED,
				StatusCode.BAD_REQUEST
			)
		);

	req.user = user;
	next();
};
