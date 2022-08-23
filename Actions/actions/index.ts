import weatherMappings from "./types/weather";
import exceptionMappings from "./types/exceptions";

const parseAndUseNLU = async (nlu: {
  intent: string;
  action: string;
  metaData: any;
  nlu_response: string;
}) => {
  try {
    const { action, metaData, nlu_response } = nlu;
    const [act, subact = "default"] = action.split(".");
    const performAction = mappings[act]?.[subact]
      ? mappings[act][subact]
      : mappings.exception.action_not_found;
    console.log("Info", nlu_response);
    if (nlu_response !== "custom_message") {
      performAction({
        metaData,
        action: act,
        subaction: subact,
        full_action: action,
      });
      return {
        custom_message: nlu_response,
        action: act,
        subaction: subact,
        full_action: action,
      };
    }
    return await performAction({
      metaData,
      action: act,
      subaction: subact,
      full_action: action,
    });
  } catch (err) {
    console.log("Error parsing NLU:", err);
    return {
      error: "There was an error parsing the NLU.",
    };
  }
};

const mappings: {
  [key: string]: {
    [key: string]: Function;
    default: Function;
  };
} = {
  weather: weatherMappings,
  parse_and_use_nlu: { default: parseAndUseNLU },
  exception: exceptionMappings,
};

export default mappings;
