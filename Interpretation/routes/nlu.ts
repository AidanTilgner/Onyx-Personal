import { Router } from "express";
import { startNLP } from "../nlp/index";
import { startNer } from "../ner/index";
import { getIntentAndAction } from "../nlp/nlp";

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

export default router;
