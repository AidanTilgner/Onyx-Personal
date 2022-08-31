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
import axios from "axios";

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
  const { action, response } = req.body;
  return res.send(addResponseToAction(action, response));
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
  const { action, response } = req.body;
  return res.send(removeResponseFromAction(action, response));
});

router.delete("/example", (req, res) => {
  const { text } = req.body;
  return res.send(removeAsExample(text));
});

router.get("/actions/supported", async (req, res) => {
  try {
    const actions = await axios
      .get("http://localhost:5002/actions")
      .then((res) => {
        return res.data.actions;
      })
      .catch((err) => {
        console.log("Error: ", err);
        return res.send({
          error: "There was an error getting the supported actions",
        });
      });
    console.log("actions", actions);
    return res.send({
      actions: actions,
      message: "Successfully retrieved supported actions",
    });
  } catch (err) {
    return res.send({
      error: "There was a problem getting the supported actions.",
    });
  }
});

export default router;
