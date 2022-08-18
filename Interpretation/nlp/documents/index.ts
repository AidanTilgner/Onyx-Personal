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
    message: `Successfully added response "${response}" of type "${type}" to action "${action}"`,
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
    message: `Successfully added action "${action}" to intent "${int}"`,
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
    message: `Successfully added text "${text}" to intent "${intent}"`,
    data: copyJSON,
  };
};

export const changeIntentForText = (
  text: string,
  newIntent: string,
  language: string = "en"
) => {
  if (!text || !newIntent) {
    return {
      error: "Text and intent are required",
    };
  }

  const copyJSON = [...text_to_intent_json];
  const existing = copyJSON.find((t) => t.text === text);

  if (!existing) {
    copyJSON.push({
      text,
      intent: newIntent,
      language,
    });
  }

  if (existing) {
    existing.intent = newIntent;
  }

  const path = `${pathToLocal}/text_to_intent.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully updated text "${text}" to have an intent of "${newIntent}"`,
    data: copyJSON,
  };
};

export const changeActionForIntent = (int: string, action: string) => {
  if (!int || !action) {
    return {
      error: "Intent and action are required",
    };
  }

  let copyJSON = { ...intent_to_action_json };
  const [intent, subintent, type = "default"] = int.split(".");
  console.log("intent", intent);
  console.log("subintent", subintent);
  console.log("type", type);

  // If obj[intent][subintent][type] exists, change it to action
  // If obj[intent][subintent][type] does not exist, create it and change it to action

  copyJSON[intent]
    ? copyJSON[intent][subintent]
      ? (copyJSON[intent][subintent][type] = action)
      : (copyJSON[intent][subintent] = { [type]: action })
    : (copyJSON[intent] = { [subintent]: { [type]: action } });

  const path = `${pathToLocal}/intent_to_action.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully updated intent "${int}" to have an action of "${action}"`,
    data: copyJSON,
  };
};

export const removeResponseFromAction = (
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
  if (!exists) {
    return {
      error: "Response does not exist",
    };
  }
  copyJSON[action][type].responses = copyJSON[action][type].responses.filter(
    (r: string) => r !== response
  );
  const path = `${pathToLocal}/action_to_response.json`;
  writeFileSync(path, JSON.stringify(copyJSON));
  return {
    message: `Successfully removed response "${response}" from action "${action}"`,
    data: copyJSON,
  };
};

export const removeActionFromIntent = (int: string) => {
  if (!int) {
    return {
      error: "Intent is required",
    };
  }

  const copyJSON = { ...intent_to_action_json };
  const [intent, subintent, type] = int.split(".");

  const action = copyJSON[intent]?.[subintent]?.[type || "default"];

  if (!action) {
    return {
      error: "This intent already has no action",
    };
  }

  copyJSON[intent][subintent][type || "default"] = null;

  const path = `${pathToLocal}/intent_to_action.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully removed action "${action}" from intent "${int}"`,
    data: copyJSON,
  };
};

export const removeAsExample = (text: string) => {
  if (!text) {
    return {
      error: "Text required",
    };
  }

  const copyJSON = [...text_to_intent_json];
  const existsIndex = copyJSON.findIndex((t) => t.text === text);

  if (!existsIndex) {
    return {
      error: "Example does not exist",
    };
  }

  copyJSON.splice(existsIndex, 1);

  const path = `${pathToLocal}/text_to_intent.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully removed example "${text}"`,
    data: copyJSON,
  };
};
