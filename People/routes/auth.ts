import { Router } from "express";
import { getResetToken } from "database/queries/tokens";
import { verifyResetToken } from "@utils/jwt";

const router = Router();

router.post("/reset", async (req, res) => {
  try {
    const { key, reset_token } = req.body;
    const { result, error, message } = await getResetToken(key);

    if (error) {
      return res.send({
        error,
        message,
      });
    }

    const { token: db_reset_token } = result as { token: string };

    res.send({
      message: "Authenticated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error authenticating",
    });
  }
});

export default router;
