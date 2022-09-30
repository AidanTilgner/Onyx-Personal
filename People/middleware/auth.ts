import { verifyToken } from "utils/jwt";
import type { Request, Response, NextFunction } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verifyToken(token);
    req.body.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error authenticating the user",
    });
  }
};
