/**
 * Erro Response if something Wrong in Application
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const errorHandler = (err, req, res, next) => {
	console.log(err, "error");
	res.status(500).send({ message: "Something went wrong" });
};
