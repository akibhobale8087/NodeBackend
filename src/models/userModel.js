import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { SCHEMA_NAMES } from "../constants";
import * as jwt from "jsonwebtoken";
import { SECURITY } from "../config";

/**
 * User DataBase Schema
 */
const user = new Schema(
	{
		userName: { type: String },
		email: { type: String },
		password: { type: String },
		contactNumber: { type: String },
		token: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

user.plugin(mongoosePaginate);
user.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			email: this.email,
		},
		SECURITY.JWTKEY
	);
	return token;
};

export const UserModel = mongoose.model(SCHEMA_NAMES.USER, user);
