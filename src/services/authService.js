import { UserModel } from "../models";
import * as bcrypt from "bcryptjs";

export const authService = {
	findUser,
	createUser,
};

/**
 * Find User By Contact Number
 * @param {*} contactNumber
 */
async function findUser(email) {
	return UserModel.findOne({ email: email });
}

/**
 * Create password as bcrypt format and Save User
 * @param {*} userData
 */
async function createUser(userData) {
	userData.password = await generateHash(userData.password);
	const userObj = new UserModel(userData);
	return userObj.save();
}

/**
 * 	Password as bcrypt format
 * @param {*} password
 */
async function generateHash(password) {
	return bcrypt.hashSync(password, 10);
}
