import weatherMappings from "./types/weather";
import exceptionMappings from "./types/exceptions";
import stateMappings from "./types/state";
import { recommendClothingMappings } from "./types/clothing";

const parseAndUseNLU = async (nlu: {
  intents: string[];
  actions: string[];
  nlu_response: string;
  entities: {
    entity: string;
    type: string;
    option: string;
  }[];
  responses: string[];
  classifications: {
    intent: string;
    score: string;
  }[];
  initial_actions: string[];
  metaData: any;
}) => {
  try {
    const {
      intents,
      actions,
      nlu_response,
      entities,
      responses,
      classifications,
      initial_actions,
      metaData,
    } = nlu;

    const toSend: {
      custom_message: string;
      actions: string[];
    } = {
      custom_message: nlu_response,
      actions: [],
    };

    for (let i = 0; i < actions.length; i++) {
      const intent = intents[i];
      const action = actions[i];
      const response = responses[i];
      const [act, subact = "default"] = action.split(".");
      // TODO: If in production, use the default action instead of saying "action not found"
      const performAction = mappings[act]?.[subact]
        ? mappings[act][subact]
        : mappings.exception.action_not_found;

      const entitiesObject: { [key: string]: string } = {};
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        entitiesObject[entity.entity] = entity.option;
      }
      if (nlu_response && response !== "custom_message") {
        // * Then do this asynchronusly
        performAction(entitiesObject);
        toSend.actions.push(action);
        toSend.custom_message = nlu_response;
      }
      const { custom_message } = await performAction(entitiesObject);

      if (custom_message) {
        toSend.custom_message += toSend.custom_message.length
          ? ". " + custom_message
          : custom_message;
      }
    }

    console.log("To send: ", toSend);

    return toSend;
  } catch (err) {
    console.log("Error parsing NLU:", err);
    return {
      error: "There was an error parsing the NLU.",
    };
  }
};

interface Mappings {
  [key: string]: {
    [key: string]: (data: any) => any;
  };
}

const mappings: Mappings = {
  weather: weatherMappings,
  parse_and_use_nlu: { default: parseAndUseNLU },
  state: stateMappings,
  exception: exceptionMappings,
  recommend_clothing: recommendClothingMappings,
};

export default mappings;
