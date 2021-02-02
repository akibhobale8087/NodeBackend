import { SERVER } from "../config";

/**
 * Server Connection with Applicaton
 * @param {*} app
 */
export const server = (app) => {
	const port = SERVER.PORT;
	app.listen(port, (_) => console.log(`server listening on port ${port}`));
};
