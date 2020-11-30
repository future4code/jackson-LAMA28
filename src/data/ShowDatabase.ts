import { DayShowsOutputDTO, Show, ShowTimeDTO, ShowWeekDay } from "../model/Show";
import BandDatabase from "./BandDatabase";
import BaseDatabase from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {

  private static TABLE_NAME = "LAMA_SHOWS";

  async getBookedShows(
    showTime: ShowTimeDTO
  ):Promise<Show[]> {
    try {
      const { weekDay, startTime, endTime } = showTime;

      const result = await this.getConnection()
        .select("*")
        .from(ShowDatabase.TABLE_NAME)
        .where('week_day', weekDay)
        .andWhere('start_time', '<', endTime)
        .andWhere('end_time', '>', endTime);
      
      return result.map((show: any) => {
        return Show.toShowModel(show);
      })
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async addShow(
    show:Show
  ):Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id: show.getId(),
          week_day: show.getWeekDay(),
          start_time: show.getStartTime(),
          end_time: show.getEndTime(),
          band_id: show.getBandId()
        })
        .into(ShowDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async getDayShows(
    day:ShowWeekDay
  ):Promise<DayShowsOutputDTO[]> {
    try {
      const result = await this.getConnection()
        .from(`${ShowDatabase.TABLE_NAME} as s`)
        .join(
          `${BandDatabase.getTable()} as b`,
          's.band_id',
          'b.id'
        )
        .select('b.name', 'b.music_genre')
        .where({ week_day: day })
        .orderBy('start_time');
      
      return result.map((show: any) => ({
          name: show.name,
          musicGenre: show.music_genre
      }));
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

}

export default new ShowDatabase();