import { Show } from "../model/Show";
import BaseDatabase from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {

  private static TABLE_NAME = "LAMA_SHOWS";

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