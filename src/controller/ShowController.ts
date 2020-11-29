import { Request, Response } from "express";
import ShowBusiness from "../business/ShowBusiness";
import BaseDatabase from "../data/BaseDatabase";
import { ShowInputDTO } from "../model/Show";

export class ShowController {
  async addShow(req:Request, res:Response):Promise<void> {
    try {
      const input: ShowInputDTO = {
        weekDay: req.body.weekDay,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        bandId: req.body.bandId,
        userToken: req.headers.authorization as string
      };

      await ShowBusiness.addShow(input);

      res.status(201).end();
    } catch (error) {
      const { code, message } = error;
      res.status(code || 400).send({ message });
    }

    await BaseDatabase.destroyConnection();
  }
}

export default new ShowController();