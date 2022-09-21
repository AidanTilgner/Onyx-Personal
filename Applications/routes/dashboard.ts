import { Router } from "express";
import { emitMessage } from "../utils/socket-io";

const router = Router();

router.post("/display-message", async (req, res) => {
  try {
    const { message } = req.body as { message: string };
    emitMessage("message", message);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
  }
});

export default router;
