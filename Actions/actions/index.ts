import weatherMappings from "./types/weather";

const parseAndUseNLU = async (nlu: {
  intent: string;
  action: string;
  metaData: any;
  nlu_response: string;
}) => {
  try {
    const { action, metaData, nlu_response } = nlu;
    if (nlu_response) {
      return {
        custom_message: nlu_response,
      };
    }
    return await mappings[action + "_from_nlu"](metaData);
  } catch (err) {
    console.log("Error parsing NLU:", err);
    return {
      error: "There was an error parsing the NLU.",
    };
  }
};

const mappings: { [key: string]: Function } = {
  get_weather: weatherMappings["get_weather"],
  get_weather_from_nlu: weatherMappings["get_weather_from_nlu"],
  parse_and_use_nlu: parseAndUseNLU,
};

export default mappings;
