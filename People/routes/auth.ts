import { Router } from "express";
import { getRefreshToken } from "database/queries/tokens";
import { verifyRefreshToken } from "@utils/jwt";
import { refreshToken } from "controllers/auth";

const router = Router();

router.post("/reset", async (req, res) => {
  try {
    const { key, reset_token } = req.body;
    const toSend = await refreshToken(key, reset_token);
    res.send(toSend);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error authenticating",
    });
  }
});

export default router;
