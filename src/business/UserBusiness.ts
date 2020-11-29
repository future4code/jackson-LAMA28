import { LoginInputDTO, User, UserInputDTO } from "../model/User";
import UnauthorizedError from "../errors/UnauthorizedError";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import authenticator,{ Authenticator } from "../services/Authenticator";
import hashManager, { HashManager } from "../services/HashManager";
import idGenerator, { IdGenerator } from "../services/IdGenerator";
import userDatabase, { UserDatabase } from "../data/UserDatabase";
import ConflictError from "../errors/ConflictError";

export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private userDatabase: UserDatabase
    ){}

    async createUser(user: UserInputDTO):Promise<string> {
        try {
            const { name, email, password, role } = user;

            if (!name || !email || !password || !role) {
                throw new UnprocessableEntityError("Missing inputs");
            }

            if (email.indexOf("@") === -1) {
                throw new UnprocessableEntityError("Invalid Email!");
            }

            if (password.length < 6) {
                throw new UnprocessableEntityError("Invalid Password!");
            }

            const id: string = this.idGenerator.generate();

            const hashPassword: string = await this.hashManager.hash(password);

            await this.userDatabase.createUser(
                new User(
                    id,
                    name,
                    email,
                    hashPassword,
                    User.stringToUserRole(role)
                )
            );

            const accessToken: string = this.authenticator.generateToken({
                id,
                role
            });

            return accessToken;
        } catch (error) {
            const { code, message } = error;

            if (error.message.includes("for key 'email'")) {
                throw new ConflictError("Email already in use")
            }

            if (code === 422) {
                throw new UnprocessableEntityError(message);
            }

            throw new Error(message);
        }

        
    }

    async getUserByEmail(user: LoginInputDTO):Promise<string> {
        try {
            const { email, password } = user;

            if (!email || !password) {
                throw new UnprocessableEntityError("Missing inputs");
             }

            const userFromDB = await this.userDatabase.getUserByEmail(email);

            if (!userFromDB) {
                throw new UnauthorizedError("Invalid credentials")
            }

            const hashCompare = await this.hashManager.compare(
                password,
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
            const { code, message } = error;

            switch (code) {
                case 422:
                    throw new UnprocessableEntityError(message);
                case 401:
                    throw new UnauthorizedError(message);
                default:
                    throw new Error(error.message);
            }
        }

        
    }
}

export default new UserBusiness(
    idGenerator,
    hashManager,
    authenticator,
    userDatabase
);