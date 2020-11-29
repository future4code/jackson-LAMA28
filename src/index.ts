import express, { Express } from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { bandRouter } from "./routes/bandRouter";
import { showRouter } from "./routes/showRouter";
import {AddressInfo} from "net";

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/band", bandRouter);
app.use("/show", showRouter);

const server = app.listen(3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
