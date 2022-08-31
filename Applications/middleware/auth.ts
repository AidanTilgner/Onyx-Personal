import { Request, Response } from "../index.d";
import { config } from "dotenv";
config({
  path: "../.env",
});

export const checkAppAuth = (req: Request, res: Response, next: Function) => {
  if (req.headers.Authorization) {
    const token = req.headers.Authorization.split(" ")[1];
    if (token !== process.env.APP_KEY) {
      res.status(401).send("Unauthorized");
    }

    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

export const checkApiAuth = (req: Request, res: Response, next: Function) => {
  if (req.headers.Authorization) {
    const token = req.headers.Authorization.split(" ")[1];
    if (token !== process.env.API_KEY) {
      res.status(401).send("Unauthorized");
    }

    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
