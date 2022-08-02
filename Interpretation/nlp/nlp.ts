import { NlpManager } from "node-nlp";
import { Text_To_Intent } from "./index.d";
import text_to_intent_json from "./documents/text_to_intent.json";

const manager = new NlpManager({
  languages: ["en"],
  forceNER: true,
  nlu: { log: false, useNoneFeature: false },
});

export const trainModel = async () => {
  try {
    console.log("Training model...");
    const text_to_intent: Text_To_Intent = text_to_intent_json;
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
  } catch (err) {
    console.log(err);
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
