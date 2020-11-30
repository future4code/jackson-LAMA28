import showDatabase, { ShowDatabase } from "../data/ShowDatabase";
import ConflictError from "../errors/ConflictError";
import UnauthorizedError from "../errors/UnauthorizedError";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import { DayShowDTO, DayShowsData, Show, ShowInputDTO, ShowTimeDTO, ShowWeekDay } from "../model/Show";
import { UserRole } from "../model/User";
import authenticator, { AuthenticationData, Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private showDatabase: ShowDatabase
  ) {}

  async addShow(show: ShowInputDTO):Promise<void> {
    try {
      const { weekDay, startTime, endTime, bandId, userToken } = show;

      const userData: AuthenticationData
        = this.authenticator.getData(userToken);

      if (userData.role !== UserRole.ADMIN) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (!weekDay || !startTime || !endTime || !bandId) {
        throw new UnprocessableEntityError("Missing inputs");
      }

      if (startTime < 8 || startTime > 22) {
        throw new UnprocessableEntityError("Invalid start time");
      }
      
      if (endTime < 9 || endTime < startTime || endTime > 23) {
        throw new UnprocessableEntityError("Invalid end time");
      }

      const showTime: ShowTimeDTO = { weekDay, startTime, endTime };

      const bookedShows = await this.showDatabase.getBookedShows(showTime);

      if (bookedShows.length) {
        throw new ConflictError(
          "A show is already booked at this time"
        )
      }

      const id: string = this.idGenerator.generate();

      await this.showDatabase.addShow(
        new Show(
          id,
          Show.stringToShowWeekDay(weekDay),
          startTime,
          endTime,
          bandId
        )
      );
    } catch (error) {
      const { code, message } = error;

      if (
        message === "jwt must be provided" ||
        message === "jwt malformed" ||
        message === "jwt expired" ||
        message === "invalid token"
      ) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (code === 401) {
        throw new UnauthorizedError(message);
      }

      if (code === 409) {
        throw new ConflictError(message);
      }

      if (code === 422) {
        throw new UnprocessableEntityError(message);
      }

      throw new Error(error.message);
    }
  };

  async getDayShows(input: DayShowDTO):Promise<DayShowsData[]> {
    try {
      if (!input.day) {
        throw new UnprocessableEntityError("Missing input");
      }

      const day: ShowWeekDay = Show.stringToShowWeekDay(input.day);

      this.authenticator.getData(input.userToken);

      const result = await this.showDatabase.getDayShows(day);

      return result
    } catch (error) {
      const { code, message } = error;

      if (
        message === "jwt must be provided" ||
        message === "jwt malformed" ||
        message === "jwt expired" ||
        message === "invalid token"
      ) {
        throw new UnauthorizedError("Invalid credentials");
      }
      
      if (code === 422) {
        throw new UnprocessableEntityError(message);
      }

      throw new Error(error.message);
    }
  };
}

export default new ShowBusiness(
  authenticator,
  idGenerator,
  showDatabase
);