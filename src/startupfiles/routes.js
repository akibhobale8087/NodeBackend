import { routeNotFound } from "../routes/routeNotMatch";
import userRoute from "../routes/userRouter";
import morgan from "morgan";
import { BASE_URL } from "../config";
import express from "express";

/**
 * Manage Route
 * @param {*} app
 */
export const Routes = (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(BASE_URL + "/uploads", express.static("uploads"));

	app.use(morgan("dev"));

	app.use(BASE_URL + "/user", userRoute);

	app.use("*", routeNotFound);
};
