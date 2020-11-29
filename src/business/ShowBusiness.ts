import showDatabase, { ShowDatabase } from "../data/ShowDatabase";
import UnauthorizedError from "../error/UnauthorizedError";
import UnprocessableEntityError from "../error/UnprocessableEntityError";
import { Show, ShowInputDTO } from "../model/Show";
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

      if (startTime < 8 && startTime > 22) {
        throw new UnprocessableEntityError("Invalid start time");
      }
      
      if (endTime < 9 && endTime < startTime && endTime > 23) {
        throw new UnprocessableEntityError("Invalid end time");
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
      const { message } = error;

      if (
        message === "jwt must be provided" ||
        message === "jwt malformed" ||
        message === "jwt expired" ||
        message === "invalid token"
      ) {
        throw new UnauthorizedError("Invalid credentials");
      }

      throw new Error(error.message);
    }
  }
}

export default new ShowBusiness(
  authenticator,
  idGenerator,
  showDatabase
);