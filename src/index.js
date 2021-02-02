const express = require("express");

import {errorHandler} from './middleware/error';
import { Cors, connectMongo, Routes, server } from "./startupfiles";

const app = express();

// enable cors
Cors(app);

// routing
Routes(app);

// connect to mongo.
connectMongo();

// start the server.
server(app);

app.use(errorHandler);
