/**
 * Cors Manage
 * Cross Origin Resorce Sharing
 * @param {*} app
 */
const cors = require("cors");
export const Cors = (app) => {
	app.use(cors());
};
