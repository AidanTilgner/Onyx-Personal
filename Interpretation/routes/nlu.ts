import { Router } from "express";
import { runNLU } from "../extraction/extract";

const router = Router();

router.post("/", (req, res) => {
  const { text } = req.body;
  const nlu = runNLU(text);
  res.send({
    message: "Successfully classified input",
    nlu: nlu,
  });
});

export default router;
