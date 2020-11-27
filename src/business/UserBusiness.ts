import UserDatabase from "../data/UserDatabase";
import UnprocessableEntityError from "../error/UnprocessableEntityError";
import { LoginInputDTO, User, UserInputDTO } from "../model/User";
import Authenticator from "../services/Authenticator";
import HashManager from "../services/HashManager";
import IdGenerator from "../services/IdGenerator";

export class UserBusiness {

    async createUser(user: UserInputDTO) {
        try {

            if (user.email.indexOf("@") === -1) {
                throw new UnprocessableEntityError("Invalid Email!")
            }

            if (user.password.length < 6) {
                throw new UnprocessableEntityError("Invalid Password!")
            }

            const id = IdGenerator.generate();

            const hashPassword = await HashManager.hash(user.password);

            await UserDatabase.createUser(
                new User(
                    id,
                    user.email,
                    user.name,
                    hashPassword,
                    User.stringToUserRole(user.role)
                )
            );

            const accessToken = Authenticator.generateToken({
                id,
                role: user.role
            });

            return accessToken;
        } catch (error) {
            throw new Error(error.message)
        }

        
    }

    async getUserByEmail(user: LoginInputDTO) {

        const userFromDB = await UserDatabase.getUserByEmail(user.email);

        const hashCompare = await HashManager.compare(user.password, userFromDB.getPassword());

        const accessToken = Authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() });

        if (!hashCompare) {
            throw new Error("Invalid Password!");
        }

        return accessToken;
    }
}

export default new UserBusiness();