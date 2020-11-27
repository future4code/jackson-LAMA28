import { LoginInputDTO, User, UserInputDTO } from "../model/User";
import UnauthorizedError from "../error/UnauthorizedError";
import UnprocessableEntityError from "../error/UnprocessableEntityError";
import authenticator,{ Authenticator } from "../services/Authenticator";
import hashManager, { HashManager } from "../services/HashManager";
import idGenerator, { IdGenerator } from "../services/IdGenerator";
import userDatabase, { UserDatabase } from "../data/UserDatabase";

export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private userDatabase: UserDatabase
    ) {}

    async createUser(user: UserInputDTO):Promise<string> {
        try {
            if (user.email.indexOf("@") === -1) {
                throw new UnprocessableEntityError("Invalid Email!")
            }

            if (user.password.length < 6) {
                throw new UnprocessableEntityError("Invalid Password!")
            }

            const id = this.idGenerator.generate();

            const hashPassword = await this.hashManager.hash(user.password);

            await this.userDatabase.createUser(
                new User(
                    id,
                    user.email,
                    user.name,
                    hashPassword,
                    User.stringToUserRole(user.role)
                )
            );

            const accessToken = this.authenticator.generateToken({
                id,
                role: user.role
            });

            return accessToken;
        } catch (error) {
            throw new Error(error.message)
        }

        
    }

    async getUserByEmail(user: LoginInputDTO) {
        try {
            const userFromDB = await this.userDatabase.getUserByEmail(user.email);

            if (!userFromDB) {
                throw new UnauthorizedError("Invalid credentials")
            }

            const hashCompare = await this.hashManager.compare(
                user.password,
                userFromDB.getPassword()
            );
            
            if (!hashCompare) {
                throw new UnauthorizedError("Invalid credentials");
            }

            const accessToken = this.authenticator.generateToken({
                id: userFromDB.getId(),
                role: userFromDB.getRole()
            });

            return accessToken;
        } catch (error) {
            throw new Error(error.message)
        }

        
    }
}

export default new UserBusiness(
    idGenerator,
    hashManager,
    authenticator,
    userDatabase
);