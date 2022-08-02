import { NlpManager } from "node-nlp";
import { Text_To_Intent } from "./index.d";
import text_to_intent_json from "./documents/text_to_intent.json";

const manager = new NlpManager({
  languages: ["en"],
  forceNER: true,
  nlp: { useNoneFeature: false },
});

export const trainModel = async () => {
  const text_to_intent: Text_To_Intent = text_to_intent_json;
  console.log("Training model...");
  text_to_intent.forEach((item) => {
    const { name, examples } = item;
    examples.forEach((example) => {
      const { text, intent, language } = example;
      manager.addDocument(language || "en", text, intent);
    });
  });

  (async () => {
    try {
      await manager.train();
      // Current timestamp
      const timestamp = new Date().getTime();
      const filename = `models/model-${timestamp}.json`;
      manager.save(filename);
      console.log("Trained");
    } catch (err) {
      console.error(err);
    }
  })();
};
