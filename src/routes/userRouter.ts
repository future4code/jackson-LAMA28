import express, { Router } from "express";
import userController from "../controller/UserController";

export const userRouter: Router = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);