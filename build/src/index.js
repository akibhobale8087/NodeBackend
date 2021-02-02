"use strict";

var _error = require("./middleware/error");

var _startupfiles = require("./startupfiles");

const express = require("express");

const app = express(); // enable cors

(0, _startupfiles.Cors)(app); // routing

(0, _startupfiles.Routes)(app); // connect to mongo.

(0, _startupfiles.connectMongo)(); // start the server.

(0, _startupfiles.server)(app);
app.use(_error.errorHandler);