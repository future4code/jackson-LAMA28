import BaseDatabase from "../data/BaseDatabase";

class MySqlReset extends BaseDatabase {

  async dropTables():Promise<void> {
    try {
      await this.getConnection()
        .raw(`DROP TABLE IF EXISTS LAMA_SHOWS;`);
      
      await this.getConnection()
        .raw(`DROP TABLE IF EXISTS LAMA_BANDS;`);
      
      await this.getConnection()
        .raw(`DROP TABLE IF EXISTS LAMA_USERS;`);

      console.log("MySql tables dropped...");
      console.log("Recreating MySql tables ...");
    } catch (error) {
      console.log(error);
    }

    await BaseDatabase.destroyConnection();
  }

}

new MySqlReset().dropTables();