import { NlpManager } from "node-nlp";
import { TextToIntent } from "./index.d";
import text_to_intent_json from "./documents/text_to_intent.json";
import intent_to_action_json from "./documents/intent_to_action.json";
import action_to_response_json from "./documents/action_to_response.json";
import { spellCheckText } from "./similarity/spellcheck";
import { writeFileSync } from "fs";

const manager = new NlpManager({
  languages: ["en"],
  forceNER: true,
  nlu: { log: false, useNoneFeature: false },
});

export const trainModel = async () => {
  try {
    console.log("Training model...");
    const text_to_intent: TextToIntent = text_to_intent_json;
    // Get a list of all intents with no duplicates
    const intentsList = [];
    text_to_intent.forEach((item) => {
      const { text, intent, language } = item;
      if (!intentsList.includes(intent)) {
        intentsList.push(intent);
      }
      manager.addDocument(language || "en", text, intent);
    });
    await manager.train();
    // Current timestamp
    const timestamp = new Date().getTime();
    const filename = `models/model-${timestamp}.json`;
    // ! Right now there's no point in saving this because it trains every load. However, this is how it would be done, and in production we might want to load from the saved version.
    // manager.save(filename);
    const list_intents = `nlp/documents/intents.json`;
    // writeFileSync(list_intents, JSON.stringify(intentsList)); // TODO: Make this happen without triggering reload in dev mode
    console.log("Trained");
    return manager;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const testModel = async () => {
  try {
    console.log("Testing model...");
    const language = "en";
    const tests = [
      {
        try: "Hello",
        expected: "greeting.hello",
      },
      {
        try: "Hi",
        expected: "greeting.hello",
      },
      {
        try: "How are you?",
        expected: "inquiry.how_are_you",
      },
      {
        try: "What is the weather like?",
        expected: "faq.weather",
      },
    ];
    tests.forEach(async (test) => {
      const { try: text } = test;
      const intent = await manager.process(language, text);
      if (intent.hasOwnProperty("nluAnswer")) {
        console.assert(
          intent.nluAnswer?.classifications[0].intent === test.expected,
          "Error in test: ",
          test,
          "Expected: ",
          test.expected,
          "Got: ",
          intent.nluAnswer?.classifications[0].intent
        );
        console.assert(
          intent.nluAnswer?.classifications[0].score > 0,
          "Error in test: ",
          test,
          "Expected non-zero score"
        );
        return;
      }
      console.assert(
        intent.classifications[0].intent === test.expected,
        "Error in test: ",
        test,
        "Expected: ",
        test.expected,
        "Got: ",
        intent.classifications[0].intent
      );
    });
    console.log("Model tested");
  } catch (err) {
    console.error(err);
  }
};

export const getIntent = async (lang: string, input: string) => {
  try {
    const intent = await manager.process(lang, input);
    return intent;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getAction = (int: string) => {
  const [intent, subintent, type] = int.split(".");
  // If intent doesn't exist on intent_to_action, return null, if it does, if subintent doesn't exist, return null, if it does, check the property at type or default, return the action
  const action =
    intent_to_action_json[intent]?.[subintent]?.[type || "default"] || null;
  if (!action) {
    return "no_action";
  }
  return action;
};

export const getResponse = (act: string, metaData?: any | null) => {
  const [action, subaction] = act.split(".");
  const responses =
    action_to_response_json[action]?.[subaction || "default"]?.responses;
  if (!responses) {
    return {
      response: "custom_message",
      responses: ["custom_message"],
    };
  }
  const response = responses[Math.floor(Math.random() * responses.length)];
  return { response, responses };
};

export const getIntentAndAction = async (input: string, lang: string) => {
  try {
    const { intent, ...rest } = await manager.process(lang, input);
    const foundIntent = intent || rest.classifications[0].intent;
    const foundAction = getAction(foundIntent);

    if (!foundIntent || rest.classifications[0].score < 0.5) {
      return {
        intent: "exception.unknown",
        action: "attempt_understanding",
        metaData: {
          ...rest,
        },
        nlu_response: "Sorry, I don't understand",
        responses: [],
      };
    }

    if (foundAction === "no_action") {
      const corrected = await spellCheckText(input);
      if (corrected) {
        return {
          intent: intent,
          action: "no_action_found",
          metaData: {
            ...rest,
            corrected: corrected,
          },
          nlu_response:
            "I get what you mean, but I don't know how to respond to that yet.",
          responses: [],
        };
      }
    }
    const { response, responses } = getResponse(foundAction);

    return {
      intent: foundIntent,
      action: foundAction,
      metaData: rest,
      nlu_response: response,
      responses,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getIntentAndActionForSpeechServer = async (input: {
  text: string;
}) => {
  try {
    const newText = spellCheckText(input.text.toLocaleLowerCase());
    const { intent, ...rest } = await manager.process("en", newText);
    const foundIntent = intent || rest.classifications[0].intent;
    const foundAction = getAction(foundIntent);
    const { response, responses } = getResponse(foundAction);
    return {
      intent: foundIntent,
      action: foundAction,
      metaData: rest,
      nlu_response: response,
      responses,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};
