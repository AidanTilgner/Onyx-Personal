import { dockStart } from "@nlpjs/basic";
import entities from "./documents/entities.json";

let manager = null;
(async () => {
  const dock = await dockStart({ use: ["Basic"] });
  manager = dock.get("nlp");
})();

export const trainNer = async () => {};

export const getEntities = async (text: string, lang?: string) => {
  const entities = await manager.findEntities(text, lang);
  return entities;
};
