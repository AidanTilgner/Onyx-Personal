import { Extraction } from "./index.d";
import { getInputMapping } from "../mappings/index";

export const runNLU = (input: string) => {
  return getInputMapping(input);
};
