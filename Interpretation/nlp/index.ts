import { testModel, trainModel } from "./nlp";

export const startNLP = async () => {
  try {
    console.log("Starting NLP...");
    await trainModel();
    await testModel();
  } catch (err) {
    console.log(err);
  }
};

export const restartNLP = async () => {
  try {
    console.log("Restarting NLP...");
    await trainModel();
    await testModel();
  } catch (err) {
    console.log(err);
  }
};
