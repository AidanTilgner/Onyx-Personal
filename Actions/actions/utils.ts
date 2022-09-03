import mappings from "./index";

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
