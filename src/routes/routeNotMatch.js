/**
 * Root Not Match Function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const routeNotFound = (req, res, next) => {
	const error = new Error("Route not Match");
	error.status = 404;
	return res.status(error.status).send({ message: error.message });
};
