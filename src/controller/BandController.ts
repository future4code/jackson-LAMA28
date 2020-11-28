import { Request, Response } from "express";
import BandBusiness from "../business/BandBusiness";
import { BandInputDTO } from "../model/Band";

export class BandController {
  async registerBand(req:Request, res:Response):Promise<void> {
    try {
      const token: string = req.headers.authorization as string;

      const input: BandInputDTO = {
        name: req.body.name,
        musicGenre: req.body.musicGenre,
        responsible: req.body.responsible,
        userToken: token
      }

      await BandBusiness.registerBand(input);

      res.status(201).end()
    } catch (error) {
      const { code, message } = error;
      res.status(code || 400).send({ message });
    }
  }
}

export default new BandController();