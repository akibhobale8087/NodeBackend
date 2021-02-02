export const MONGO_CONFIG = {
	URI: "mongodb://localhost:27017/TASK",

	DEBUG: "",
	SSl_CA: "",
	SSl_CERT: "",
	SSl_KEY: "",
};

export const BASE_URL = "/api/v1";

export const SERVER = {
	PORT: process.env.PORT || 8000,
};

export const SECURITY = {
	JWTKEY: "TEST123",
};
