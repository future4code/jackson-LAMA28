import UserDatabase from "../data/UserDatabase";
import { LoginInputDTO, UserInputDTO } from "../model/User";
import Authenticator from "../services/Authenticator";
import HashManager from "../services/HashManager";
import IdGenerator from "../services/IdGenerator";

export class UserBusiness {

    async createUser(user: UserInputDTO) {

        const id = IdGenerator.generate();

        const hashPassword = await HashManager.hash(user.password);

        await UserDatabase.createUser(id, user.email, user.name, hashPassword, user.role);

        const accessToken = Authenticator.generateToken({ id, role: user.role });

        return accessToken;
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