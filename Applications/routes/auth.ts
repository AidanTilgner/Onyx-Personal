import { Router } from "express";
import { config } from "dotenv";

config({ path: "../.env" });

const router = Router();

router.post("/check", (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.send({
      message: "You are currently unauthorized to use Onyx Dashboard.",
      authorized: false,
    });
  }
  if (token !== process.env.APP_KEY) {
    return res.send({
      message: "You are currently unauthorized to use Onyx Dashboard.",
      authorized: false,
    });
  }
  return res.status(200).send({
    message: "Authorized",
    authorized: true,
  });
});

export default router;
