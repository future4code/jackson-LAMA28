import { Request, Response } from "express";
import BandBusiness from "../business/BandBusiness";
import BaseDatabase from "../data/BaseDatabase";
import { Band, BandInputDTO, GetBandsInputDTO } from "../model/Band";

export class BandController {
  async registerBand(req:Request, res:Response):Promise<void> {
    try {
      const input: BandInputDTO = {
        name: req.body.name,
        musicGenre: req.body.musicGenre,
        responsible: req.body.responsible,
      };

      await BandBusiness.registerBand(
        input,
        req.headers.authorization as string
        );

      res.status(201).end();
    } catch (error) {
      const { code, message } = error;
      res.status(code || 400).send({ message });
    }

    await BaseDatabase.destroyConnection();
  }

  async getBands(req:Request, res:Response):Promise<void> {
    try {
      const input: GetBandsInputDTO = {
        id: req.params.id,
        name: req.query.name as string
      };

      const result: {band: Band} | {bands: Band[]}
        = await BandBusiness.getBands(input, req.headers.authorization as string);

      res.status(200).send(result);
    } catch (error) {
      const { code, message } = error;
      res.status(code || 400).send({ message });
    }

    await BaseDatabase.destroyConnection();
  }
}

export default new BandController();