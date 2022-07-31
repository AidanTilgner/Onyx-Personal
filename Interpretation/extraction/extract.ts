import { Extraction } from "./index.d";
import { getInputMapping } from "../mappings/index";

export const runNLU = (input: string) => {
  return getInputMapping(input.toLowerCase());
};

export const runNLU_for_speech_server = (input: { text: string }) => {
  return getInputMapping(input.text.toLowerCase());
};
