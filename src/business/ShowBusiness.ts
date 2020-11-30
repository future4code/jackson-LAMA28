import bandDatabase, { BandDatabase } from "../data/BandDatabase";
import showDatabase, { ShowDatabase } from "../data/ShowDatabase";
import ConflictError from "../errors/ConflictError";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import { Band } from "../model/Band";
import { DayShowsInputDTO, DayShowsOutputDTO, Show, ShowInputDTO, ShowTimeDTO, ShowWeekDay } from "../model/Show";
import { UserRole } from "../model/User";
import authenticator, { AuthenticationData, Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private showDatabase: ShowDatabase,
    private bandDatabase: BandDatabase
  ) {}

  async addShow(show: ShowInputDTO, userToken: string):Promise<void> {
    try {
      const { weekDay, startTime, endTime, bandId } = show;

      const userData: AuthenticationData
        = this.authenticator.getData(userToken);

      if (userData.role !== UserRole.ADMIN) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (!weekDay || !startTime || !endTime || !bandId) {
        throw new UnprocessableEntityError("Missing inputs");
      }

      const band: Band[] = await this.bandDatabase.getBands({id: bandId});

      if (!band.length) {
        throw new NotFoundError("Band not found");
      }

      if (startTime < 8 || endTime > 23 || endTime < startTime) {
        throw new UnprocessableEntityError("Invalid show times");
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

      if (code === 404) {
        throw new NotFoundError(message);
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

  async getDayShows(
    input: DayShowsInputDTO, userToken: string
  ):Promise<DayShowsOutputDTO[]> {
    try {
      if (!input.day) {
        throw new UnprocessableEntityError("Missing input");
      }

      const weekDay: ShowWeekDay = Show.stringToShowWeekDay(input.day);

      this.authenticator.getData(userToken);

      const result = await this.showDatabase.getDayShows(weekDay);

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
  showDatabase,
  bandDatabase
);