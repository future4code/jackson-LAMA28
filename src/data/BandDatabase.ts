import { Band, GetBandsInputDTO } from "../model/Band";
import BaseDatabase from "./BaseDatabase";

export class BandDatabase extends BaseDatabase {

  private static TABLE_NAME = "LAMA_BANDS";

  getTable(): string{
    return BandDatabase.TABLE_NAME
  }

  async registerBand(
    band:Band
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

  async getBands(
    input:GetBandsInputDTO
  ):Promise<Band[]> {
    try {
      const { id, name } = input

      const result = await this.getConnection()
        .select("*")
        .from(BandDatabase.TABLE_NAME)
        .where(
          id ? { id } : (search: any) => {
            search.where('name', 'LIKE', `%${name}%`)
          }
        );

      return result.map((band: any) => {
        return Band.toBandModel(band);
      })
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)  
    }
  }

}

export default new BandDatabase();