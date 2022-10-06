import { Router } from "express";
import { config } from "dotenv";
import { peopleServer } from "../utils/axios";

config({ path: "../.env" });

const router = Router();

router.post("/check", async (req, res) => {
  try {
    const token = req.body.token;
    const response = await peopleServer
      .post("/auth/check", {
        token,
      })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response.status !== 200 || err.response.status !== 401) {
          console.error(err);
        }
        return {
          data: {
            error: err,
            message: "There was an error authenticating",
            validated: false,
          },
        };
      });
    const { validated, message, error } = response.data as {
      validated: boolean;
      message: string;
      error: any;
    };

    if (!validated) {
      return res.status(401).send({
        message,
        validated,
      });
    }

    return res.status(200).send({
      message: "Authorized",
      authorized: true,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/login-url", (req, res) => {
  const url = process.env.PEOPLE_SERVER_LOGIN_URL;
  res.send({ url });
});

export default router;
