import { Router } from "express";
import {
  getTrainingData,
  addResponseToAction,
  addActionToIntent,
  addIntentToText,
  changeIntentForText,
  changeActionForIntent,
  removeActionFromIntent,
  removeResponseFromAction,
  removeAsExample,
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

router.put("/intent", (req, res) => {
  const { text, intent, language } = req.body;
  return res.send(changeIntentForText(text, intent, language));
});

router.put("/action", (req, res) => {
  const { intent, action } = req.body;
  return res.send(changeActionForIntent(intent, action));
});

router.delete("/action", (req, res) => {
  const { intent } = req.body;
  return res.send(removeActionFromIntent(intent));
});

router.delete("/response", (req, res) => {
  const { action, response, type } = req.body;
  return res.send(removeResponseFromAction(action, response, type));
});

router.delete("/example", (req, res) => {
  const { text } = req.body;
  return res.send(removeAsExample(text));
});

export default router;
