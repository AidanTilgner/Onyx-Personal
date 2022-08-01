import { NlpManager } from "node-nlp";
import { Text_To_Intent } from ".";

const manager = new NlpManager({
  languages: ["en"],
  forceNER: true,
  nlp: { useNoneFeature: false },
});

const trainModel = async () => {
  // * Train Intents
  const text_to_intent: Text_To_Intent = await import(
    "./documents/text_to_intent.json"
  );

  text_to_intent.forEach((item) => {
    const { name, examples } = item;
    examples.forEach((example) => {
      const { text, intent, language } = example;
      manager.addDocument(language || "en", text, intent);
    });
  });

  (async () => {
    await manager.train();
    console.log("Trained");
  })();
};
