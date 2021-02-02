import { UserModel, ProductModel } from "../models";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const userService = {
	updateUser,
	deleteProduct,
	logoutUser,
	findUserById,

	findUser,
	addProduct,
	allProduct,
};

/**
 * Update user Data
 * @param {*} userData
 */
async function updateUser(userData) {
	return await UserModel.findOneAndUpdate(
		{ _id: ObjectId(userData._id) },
		{ $set: userData },
		// { new: true }
		{
			fields: { password: 0 },
			new: true,
		}
	);
}

async function logoutUser(userId, role) {
	let set = {
		deviceToken: null,
		token: null,
		isActive: false,
	};
	if (role == ROLES[1]) {
		set.driverMode = DRIVER_MODE[1];
	}
	return UserModel.updateOne({ _id: ObjectId(userId) }, { $set: set });
}

async function findUserById(userId) {
	return UserModel.findById(
		{ _id: ObjectId(userId) },
		{ password: 0, token: 0 }
	);
}

/**
 * find user using email id
 * @param {*} email
 */
async function findUser(email) {
	return await UserModel.findOne({ email: email });
}

async function addProduct(productInfo) {
	const product = new ProductModel(productInfo);
	return await product.save();
}

async function allProduct() {
	return await ProductModel.find();
}

async function deleteProduct(id) {
	return await ProductModel.deleteOne({ _id: id });
}
