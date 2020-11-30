import { Request, Response } from "express";
import ShowBusiness from "../business/ShowBusiness";
import BaseDatabase from "../data/BaseDatabase";
import { DayShowsInputDTO, DayShowsOutputDTO, ShowInputDTO } from "../model/Show";

export class ShowController {
  async addShow(req:Request, res:Response):Promise<void> {
    try {
      const input: ShowInputDTO = {
        weekDay: req.body.weekDay,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        bandId: req.body.bandId,
      };

      await ShowBusiness.addShow(input, req.headers.authorization as string);

      res.status(201).end();
    } catch (error) {
      const { code, message } = error;
      res.status(code || 400).send({ message });
    }

    await BaseDatabase.destroyConnection();
  }

  async getDayShows(req:Request, res:Response):Promise<void> {
    try {
      const input: DayShowsInputDTO = {
        day: req.query.day as string
      }

      const result: DayShowsOutputDTO[] = await ShowBusiness.getDayShows(
        input,
        req.headers.authorization as string
      );

      res.status(201).send(result);
    } catch (error) {
      const { code, message } = error;
      res.status(code || 400).send({ message });
    }

    await BaseDatabase.destroyConnection();
  }
}

export default new ShowController();