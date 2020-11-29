import express, { Router } from "express";
import bandController from "../controller/BandController";

export const bandRouter: Router = express.Router();

bandRouter.post("/register", bandController.registerBand);
bandRouter.get("/search/:id?", bandController.getBands);