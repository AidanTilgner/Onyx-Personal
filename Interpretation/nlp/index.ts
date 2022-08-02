import { testModel, trainModel } from "./nlp";

export const startNLP = async () => {
  console.log("Starting NLP...");
  await trainModel();
  await testModel();
};
