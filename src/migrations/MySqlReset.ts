import { BaseDatabase } from "../data/BaseDatabase";
import MySqlSetup from "./MySqlSetup";

class MySqlReset extends BaseDatabase {

  async resetTables():Promise<void> {
    try {
      await this.getConnection()
        .raw(`DROP TABLE LAMA_SHOWS;`);
      
      await this.getConnection()
        .raw(`DROP TABLE LAMA_BANDS;`);
      
      await this.getConnection()
        .raw(`DROP TABLE LAMA_USERS;`);

      console.log("MySql tables dropped...");
      console.log("Recreating MySql tables ...");

      await new MySqlSetup().createTables();

      console.log("MySql reset completed!");
    } catch (error) {
      console.log(error);
    }

    await BaseDatabase.destroyConnection();
  }

}

new MySqlReset().resetTables();