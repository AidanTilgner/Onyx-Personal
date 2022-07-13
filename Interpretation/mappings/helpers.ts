import { Mappings } from "./index.d";

export const calculateScore = (input: string[], mappings: Mappings): number => {
  let score = 0;

  input.forEach((token) => {
    if (mappings[token]) {
      score += mappings[token].value;
    }
  });

  return score;
};
