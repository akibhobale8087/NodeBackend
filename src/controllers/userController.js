import Response from "../utils/Response";
import { CustomMessages, StatusCode, ROLES } from "../constants";
import { authService, carService, userService } from "../services";
import { Validations } from "../validations";
import * as bcrypt from "bcryptjs";
export const userController = {
	ping,
	signup,
	loginUser,
	logout,
	addproduct,
	productList,
	deleteProduct,
};

async function ping(req, res) {
	return res.send(
		Response.sendResponse(
			true,
			"",
			CustomMessages.RECORD_CREATED,
			StatusCode.OK
		)
	);
}

async function signup(req, res) {
	try {
		// validate request
		const { error } = Validations.validateSignupPassenger(req.body);
		if (error)
			return res.send(
				Response.sendResponse(
					false,
					null,
					error.details[0].message,
					StatusCode.BAD_REQUEST
				)
			);

		const { password, email } = req.body;

		const user = await authService.findUser(email);
		if (user)
			return res.send(
				Response.sendResponse(
					false,
					null,
					CustomMessages.USER_EXIST,
					StatusCode.FOUND
				)
			);
		const userSave = await authService.createUser(req.body);
		//  success response
		return res.send(
			Response.sendResponse(true, null, CustomMessages.SUCCESS, StatusCode.OK)
		);
	} catch (error) {
		return res.send(
			Response.sendResponse(
				false,
				null,
				error.message,
				StatusCode.INTERNAL_SERVER_ERROR
			)
		);
	}
}

async function loginUser(req, res) {
	try {
		const { error } = Validations.ValidateLogin(req.body);
		if (error)
			return res.send(
				Response.sendResponse(
					false,
					null,
					error.details[0].message,
					StatusCode.BAD_REQUEST
				)
			);

		const { email, password } = req.body;
		console.log(req.body, "Request Body");
		const user = await authService.findUser(email);
		if (!user)
			return res.send(
				Response.sendResponse(
					false,
					null,
					CustomMessages.INCORRECT_EMAIL,
					StatusCode.BAD_REQUEST
				)
			);

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword)
			return res.send(
				Response.sendResponse(
					false,
					null,
					CustomMessages.INCORRECT_PASSWORD,
					StatusCode.BAD_REQUEST
				)
			);

		const token = user.generateAuthToken();

		const userData = { _id: user._id, token };

		let updateUserData = await userService.updateUser(userData);

		return res.send(
			Response.sendResponse(
				true,
				updateUserData,
				CustomMessages.LOGIN_SUCCESS,
				StatusCode.OK
			)
		);
	} catch (error) {
		return res.send(
			Response.sendResponse(
				false,
				null,
				error.message,
				StatusCode.INTERNAL_SERVER_ERROR
			)
		);
	}
}

async function logout(req, res) {
	try {
		let { _id, role } = req.user;
		let result = await userService.logoutUser(_id, role);
		return res.send(
			Response.sendResponse(
				true,
				null,
				CustomMessages.LOGOUT_SUCCESS,
				StatusCode.OK
			)
		);
	} catch (error) {
		return res.send(
			Response.sendResponse(
				false,
				null,
				error.message,
				StatusCode.INTERNAL_SERVER_ERROR
			)
		);
	}
}

async function addproduct(req, res) {
	try {
		const { error } = Validations.ValidateProduct(req.body);
		if (error)
			return res.send(
				Response.sendResponse(
					false,
					null,
					error.details[0].message,
					StatusCode.BAD_REQUEST
				)
			);

		let { name, price, quantity, description } = req.body;
		let result = await userService.addProduct(req.body);
		return res.send(
			Response.sendResponse(true, null, CustomMessages.SUCCESS, StatusCode.OK)
		);
	} catch (error) {
		return res.send(
			Response.sendResponse(
				false,
				null,
				error.message,
				StatusCode.INTERNAL_SERVER_ERROR
			)
		);
	}
}

async function productList(req, res) {
	try {
		let result = await userService.allProduct();
		return res.send(
			Response.sendResponse(
				true,
				result,
				CustomMessages.GET_ALL_RECORDS,
				StatusCode.OK
			)
		);
	} catch (error) {
		return res.send(
			Response.sendResponse(
				false,
				null,
				error.message,
				StatusCode.INTERNAL_SERVER_ERROR
			)
		);
	}
}

async function deleteProduct(req, res) {
	try {
		let id = req.params.id;
		console.log(id);
		let result = await userService.deleteProduct(id);
		return res.send(
			Response.sendResponse(
				true,
				result,
				CustomMessages.RECORD_DELETED_SUCCESS,
				StatusCode.OK
			)
		);
	} catch (error) {
		return res.send(
			Response.sendResponse(
				false,
				null,
				error.message,
				StatusCode.INTERNAL_SERVER_ERROR
			)
		);
	}
}
