import express, { Express } from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import {AddressInfo} from "net";

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

const server = app.listen(3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});
