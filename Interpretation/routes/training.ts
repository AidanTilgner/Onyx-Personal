import { Router } from "express";
import {
  getTrainingData,
  addResponseToAction,
  addActionToIntent,
  addIntentToText,
} from "../nlp/documents/index";

const router = Router();

router.get("/", (req, res) => {
  return res.send({
    message: "Successfully retrieved NLU data",
    data: getTrainingData(),
  });
});

router.post("/intent", (req, res) => {
  const { text, intent, language } = req.body;
  return res.send(addIntentToText(text, intent, language));
});

router.post("/action", (req, res) => {
  const { action, response } = req.body;
  return res.send(addActionToIntent(action, response));
});

router.post("/response", (req, res) => {
  const { action, response, type } = req.body;
  return res.send(addResponseToAction(action, response, type));
});

export default router;
