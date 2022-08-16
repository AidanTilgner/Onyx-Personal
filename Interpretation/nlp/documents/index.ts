import { writeFileSync } from "fs";

import action_to_response_json from "./action_to_response.json";
import intent_to_action_json from "./intent_to_action.json";
import text_to_intent_json from "./text_to_intent.json";

const pathToLocal = "./nlp/documents";

export const getTrainingData = () => {
  return {
    action_to_response: action_to_response_json,
    intent_to_action: intent_to_action_json,
    text_to_intent: text_to_intent_json,
  };
};

export const addResponseToAction = (
  action: string,
  response: string,
  type: string = "default"
) => {
  if (!action || !response) {
    return {
      error: "Action and response required",
    };
  }
  const copyJSON = { ...action_to_response_json };
  const exists = copyJSON[action]?.[type]?.includes(response);
  if (exists) {
    return {
      error: "Response already exists",
    };
  }
  copyJSON[action][type].responses = [
    ...copyJSON[action][type].responses,
    response,
  ];
  const path = `${pathToLocal}/action_to_response.json`;
  writeFileSync(path, JSON.stringify(copyJSON));
  return {
    message: "Successfully added response to action",
    data: copyJSON,
  };
};

export const addActionToIntent = (int: string, action: string) => {
  if (!int || !action) {
    return {
      error: "Intent and action are required",
    };
  }
  action = action.toLowerCase();
  // Action needs to be of format "action_name" only containing lowercase letters and underscores
  const regex = /^[a-z_]+$/;
  if (!regex.test(action)) {
    return {
      error: "Action must only contain letters and underscores",
    };
  }
  const copyJSON = { ...intent_to_action_json };
  const [intent, subintent, type] = int.split(".");

  copyJSON[intent][subintent][type || "default"] = action;

  const path = `${pathToLocal}/intent_to_action.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: "Successfully added action to intent",
    data: copyJSON,
  };
};

export const addIntentToText = (
  text: string,
  intent: string,
  language: string = "en"
) => {
  if (!text || !intent) {
    return {
      error: "Text and intent are required",
    };
  }
  const exists = text_to_intent_json.find(
    (t) => t.text === text && t.intent === intent
  );
  if (exists) {
    return {
      error: "Mapping already exists, try changing the text or the intent",
    };
  }
  const copyJSON = [...text_to_intent_json];
  copyJSON.push({
    text,
    intent,
    language,
  });

  const path = `${pathToLocal}/text_to_intent.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: "Successfully added intent to text",
    data: copyJSON,
  };
};
