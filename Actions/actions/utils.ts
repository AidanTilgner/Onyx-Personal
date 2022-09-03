import mappings from "./index";
import action_metadata_mappings from "./documents/action_metadata_mappings.json";

export const checkActionExists = (act: string) => {
  const [action, subaction = "default"] = act.split(".");

  if (mappings[action] && mappings[action][subaction]) {
    return true;
  }

  return false;
};

export const getAction = (act: string) => {
  const [action, subaction = "default"] = act.split(".");

  if (mappings[action] && mappings[action][subaction]) {
    return mappings[action][subaction];
  }

  return null;
};

export const getActionMetadata = (act: string) => {
  const [action, subaction = "default"] = act.split(".");
  const jsonCopy = action_metadata_mappings as {
    [key: string]: { [key: string]: any };
  };

  return jsonCopy[action]?.[subaction];
};
