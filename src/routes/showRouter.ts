import express, { Router } from "express";
import showController from "../controller/ShowController";

export const showRouter: Router = express.Router();

showRouter.post("/add", showController.addShow);
showRouter.get("/search", showController.getDayShows);