import { Router } from "express";
import { config } from "dotenv";

config({ path: "../.env" });

const router = Router();

router.get("/", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
  }
  if (token !== process.env.API_KEY) {
    res.status(401).send({ message: "Unauthorized" });
  }
  res.send({
    message: "Authorized",
  });
});

export default router;
