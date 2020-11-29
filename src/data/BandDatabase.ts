import { Band } from "../model/Band";
import BaseDatabase from "./BaseDatabase";

export class BandDatabase extends BaseDatabase {

  private static TABLE_NAME = "LAMA_BANDS";

  public async registerBand(
    band: Band
  ):Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id: band.getId(),
          name: band.getName(),
          music_genre: band.getMusicGenre(),
          responsible: band.getResponsible()
        })
        .into(BandDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new BandDatabase();