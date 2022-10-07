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
          error: err,
          message: "There was an error authenticating",
          validated: false,
        };
      });

    console.log("response", response);
    const { validated, message, error } = response as {
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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("username", username);
    console.log("password", password);
    const response = await peopleServer.post(`/users/signin`, {
      username,
      password,
    });
    const { data } = response;
    if (data.error) {
      return res.status(401).send({
        message: data.message,
        error: data.error,
      });
    }
    console.log("response", data);
    res.send({
      message: "Logged in",
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (err) {
    console.error(err);
    res.send({
      message: "There was an error logging in",
      error: err,
    });
  }
});

export default router;
