import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { SCHEMA_NAMES } from "../constants";

/**
 * User DataBase Schema
 */
const product = new Schema(
	{
		name: { type: String },
		quantity: { type: Number },
		price: { type: Number },
		description: { type: String },
	},
	{
		timestamps: true,
	}
);

product.plugin(mongoosePaginate);

export const ProductModel = mongoose.model(SCHEMA_NAMES.PRODUCT, product);
