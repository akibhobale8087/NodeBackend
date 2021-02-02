import mongoose from "mongoose";
import debug from "debug";
import fs from "fs";
import { MONGO_CONFIG } from "../config";

const log = debug("app:mongo");

mongoose.set("debug", MONGO_CONFIG.DEBUG);

/**
 * MongoDB Connection Bridge
 */
const connectMongo = async () => {
	const connectionuri = MONGO_CONFIG.URI;
	let sslOptions = {};

	if (MONGO_CONFIG.SSl_CA && MONGO_CONFIG.SSl_CERT && MONGO_CONFIG.SSl_KEY) {
		const ca = [fs.readFileSync(MONGO_CONFIG.SSl_CA)];
		const cert = fs.readFileSync(MONGO_CONFIG.SSl_CERT);
		const key = fs.readFileSync(MONGO_CONFIG.SSl_KEY);
		sslOptions = {
			ssl: true,
			sslValidate: true,
			sslCA: ca,
			sslKey: key,
			sslCert: cert,
		};
	}
	const options = {
		...sslOptions,
		useUnifiedTopology: true,
		// autoReconnect: true,
		connectTimeoutMS: 5000,
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
	};

	console.log("successfully connected to database.");
	await mongoose.connect(connectionuri, options).catch((error) => {
		console.log("ERROR connecting to mongo: " + error);
		process.exit(1);
	});
};

export { connectMongo };
