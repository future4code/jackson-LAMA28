import { Show, ShowTimeDTO } from "../model/Show";
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
        .where(function() {
          this
            .whereBetween('start_time', [startTime+0.1, endTime-0.1])
            .orWhereBetween('end_time', [startTime+0.1, endTime-0.1])
        }).andWhere('week_day', weekDay);
      
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

}

export default new ShowDatabase();