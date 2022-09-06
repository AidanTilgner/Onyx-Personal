import { Router } from "express";
import { startNLP } from "../nlp/index";
import { getIntentAndAction, unstable_getNLUData } from "../nlp/nlp";

const router = Router();

startNLP();
// startNer();

router.post("/", async (req, res) => {
  const { text, language } = req.body;
  const nlu = await getIntentAndAction(text, language || "en");
  res.send({
    message: "Successfully classified input",
    nlu: nlu,
  });
});

router.post("/unstable", async (req, res) => {
  const { text, language } = req.body;
  const nlu = await unstable_getNLUData(
    "fake_session_id",
    text,
    language || "en"
  );
  res.send({
    message: "Successfully classified input",
    nlu: nlu,
  });
});

export default router;
