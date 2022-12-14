// Importing all handlers
import './handlers';

import express, {Request, Response} from "express";

import {Server} from "typescript-rest";
import { TryDBConnect } from "./helpers";
import bodyParser from "body-parser";
import cors from "cors";

export const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());

app.use(async (req: Request, res: Response, next) => {
  await TryDBConnect(() => {
    res.json({
      error: 'Database connection error, please try again later',
    });
  }, next);
});


Server.buildServices(app);

// Just checking if given PORT variable is an integer or not
let port = parseInt(process.env.PORT || "");
if (isNaN(port) || port === 0) {
  port = 4000;
}

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server Started at PORT: ${port}`);
});

