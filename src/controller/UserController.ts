import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO} from "../model/User";
import BaseDatabase from "../data/BaseDatabase";
import UserBusiness from "../business/UserBusiness";

export class UserController {
    async signup(req: Request, res: Response):Promise<void> {
        try {
            const input: UserInputDTO = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: req.body.role
            }

            const token = await UserBusiness.createUser(input);

            res.status(200).send({ token });
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message });
        }

        await BaseDatabase.destroyConnection();
    }

    async login(req: Request, res: Response):Promise<void> {
        try {
            const loginData: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            };

            const token = await UserBusiness.getUserByEmail(loginData);

            res.status(200).send({ token });
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message });
        }

        await BaseDatabase.destroyConnection();
    }

}

export default new UserController();