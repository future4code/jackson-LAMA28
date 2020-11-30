import bandDatabase, { BandDatabase } from "../data/BandDatabase";
import ConflictError from "../errors/ConflictError";
import UnauthorizedError from "../errors/UnauthorizedError";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import { Band, BandInputDTO, GetBandsInputDTO } from "../model/Band";
import { UserRole } from "../model/User";
import authenticator, { AuthenticationData, Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class BandBusiness {
  constructor(
    private authenticator: Authenticator,
    private idGenerator: IdGenerator,
    private bandDatabase: BandDatabase
  ){}

  async registerBand(band: BandInputDTO, userToken: string):Promise<void> {
    try {
      const { name, musicGenre, responsible } = band;

      const userData: AuthenticationData 
        = this.authenticator.getData(userToken);
      
      if (userData.role !== UserRole.ADMIN) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (!name || !musicGenre || !responsible) {
        throw new UnprocessableEntityError("Missing inputs");
      }

      const id: string = this.idGenerator.generate();

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

      throw new Error(message)
    }
  }

  async getBands(
    input: GetBandsInputDTO, userToken: string
  ): Promise<{band: Band} | {bands: Band[]}> {
    try {
      this.authenticator.getData(userToken);

      const bands: Band[] = await this.bandDatabase.getBands(input);

      if (bands.length === 1) {
        return {band:bands[0]}
      }

      return {bands}
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

      throw new Error(message)
    }
  }
}

export default new BandBusiness(
  authenticator,
  idGenerator,
  bandDatabase
);