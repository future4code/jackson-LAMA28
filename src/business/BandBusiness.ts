import bandDatabase, { BandDatabase } from "../data/BandDatabase";
import ConflictError from "../error/ConflictError";
import UnauthorizedError from "../error/UnauthorizedError";
import UnprocessableEntityError from "../error/UnprocessableEntityError";
import { Band, BandInputDTO } from "../model/Band";
import { UserRole } from "../model/User";
import authenticator, { AuthenticationData, Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class BandBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private bandDatabase: BandDatabase
  ){}

  async registerBand(band: BandInputDTO):Promise<void> {
    try {
      const { name, musicGenre, responsible, userToken } = band;

      const userData: AuthenticationData = this.authenticator.getData(userToken);
      
      if (userData.role !== UserRole.ADMIN) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (!name || !musicGenre || !responsible) {
        throw new UnprocessableEntityError("Missing inputs");
      }

      const id = this.idGenerator.generate();

      await this.bandDatabase.registerBand(
        new Band(
          id,
          name,
          musicGenre,
          responsible
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

      if (message.includes("for key 'name'")) {
        throw new ConflictError("Name already in use");
      }

      if (message.includes("for key 'responsible'")) {
        throw new ConflictError(
          "This person is already responsible for another band"
        );
      }

      if (code === 401) {
        throw new UnauthorizedError(message);
      }

      if (code === 422) {
        throw new UnprocessableEntityError(message);
      }
    }
  }
}

export default new BandBusiness(
  authenticator,
  idGenerator,
  bandDatabase
);