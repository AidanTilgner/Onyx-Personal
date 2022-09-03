import { trainNer } from "./ner";

export const startNer = async () => {
  try {
    console.log("Starting NER...");
    await trainNer();
  } catch (err) {
    console.log(err);
  }
};
