import { peopleApi } from "../config/axios";
import type { Request, Response, NextFunction } from "express";

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const access_token =
      req.body.access_token ||
      req.query.access_token ||
      req.query.api_key ||
      req.headers["x-access-token"];

    if (!access_token) {
      return res.status(401).json({
        message: "Unauthorized",
        authorized: false,
      });
    }

    const response = await peopleApi
      .post("/api/auth/check", {
        token: access_token,
      })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response.status !== 200 || err.response.status !== 401) {
          console.error(err);
        }
        return {
          error: err,
          message: "There was an error authenticating",
          validated: false,
        };
      });

    const { validated, message, error } = response as {
      validated: boolean;
      message: string;
      error: any;
    };

    if (!validated) {
      return res.status(401).send({
        message,
        validated: false,
      });
    }

    next();
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
