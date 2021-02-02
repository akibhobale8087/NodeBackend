import * as Joi from "joi";

export const Validations = {
	validateSignupPassenger,
	ValidateLogin,
	ValidateProduct,
};

function validateSignupPassenger(user) {
	const schema = Joi.object({
		password: Joi.string().min(3).max(255).required(),
		email: Joi.string().email().required(),
	});
	return schema.validate(user);
}

/**
 * Login Validation
 */

function ValidateLogin(user) {
	const schema = Joi.object({
		password: Joi.string().min(3).max(255).required(),
		email: Joi.string().email().required(),
	});
	return schema.validate(user);
}

function ValidateProduct(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required(),
		quantity: Joi.number().required(),
		price: Joi.number().required(),
		description: Joi.string(),
	});
	return schema.validate(user);
}
