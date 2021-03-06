import BaseDatabase from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {

  private static TABLE_NAME = "LAMA_USERS";

  async createUser(
    user:User
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id: user.getId(),
          email: user.getEmail(),
          name: user.getName(),
          password: user.getPassword(),
          role: user.getRole()
        })
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async getUserByEmail(
    email: string
  ): Promise<User> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(UserDatabase.TABLE_NAME)
        .where({ email });
  
      return User.toUserModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

}

export default new UserDatabase();
