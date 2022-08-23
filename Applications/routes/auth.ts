import { Router } from "express";
import { config } from "dotenv";

config({ path: "../.env" });

const router = Router();

router.get("/check", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .send({
        message: "You are currently unauthorized to use Onyx Dashboard.",
      });
  }
  if (token !== process.env.API_KEY) {
    res
      .status(401)
      .send({
        message: "You are currently unauthorized to use Onyx Dashboard.",
      });
  }
  res.status(200).send({
    message: "Authorized",
  });
});

export default router;
