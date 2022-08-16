import { NlpManager } from "node-nlp";
import { TextToIntent } from "./index.d";
import text_to_intent_json from "./documents/text_to_intent.json";
import intent_to_action_json from "./documents/intent_to_action.json";
import action_to_response_json from "./documents/action_to_response.json";
import { spellCheckText } from "./similarity/spellcheck";

const manager = new NlpManager({
  languages: ["en"],
  forceNER: true,
  nlu: { log: false, useNoneFeature: false },
});

export const trainModel = async () => {
  try {
    console.log("Training model...");
    const text_to_intent: TextToIntent = text_to_intent_json;
    text_to_intent.forEach((item) => {
      const { name, examples } = item;
      examples.forEach((example) => {
        const { text, intent, language } = example;
        manager.addDocument(language || "en", text, intent);
      });
    });
    await manager.train();
    // Current timestamp
    const timestamp = new Date().getTime();
    const filename = `models/model-${timestamp}.json`;
    manager.save(filename);
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
        console.log(`${text} => ${intent.nluAnswer.classifications[0].intent}`);
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
      console.log(`${text} => ${intent.classifications[0].intent}`);
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
  const [intent, subintent] = int.split(".");
  const action = intent_to_action_json[intent][subintent].action;
  if (!action) {
    return "i_dont_understand";
  }
  return action;
};

export const getResponse = (action: string, metaData?: any | null) => {
  const responses = action_to_response_json[action]?.responses?.default;
  if (!responses) {
    return "custom_message";
  }
  const response = responses[Math.floor(Math.random() * responses.length)];
  return response;
};

export const getIntentAndAction = async (lang: string, input: string) => {
  try {
    const { intent, ...rest } = await manager.process(lang, input);
    const foundIntent = intent || rest.classifications[0].intent;
    const foundAction = getAction(foundIntent);

    return {
      intent: foundIntent,
      action: foundAction,
      metaData: rest,
      nlu_response: getResponse(foundAction),
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
    return {
      intent: foundIntent,
      action: foundAction,
      metaData: rest,
      nlu_response: getResponse(foundAction),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};
