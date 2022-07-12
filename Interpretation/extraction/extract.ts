import "./index";
import { WordTokenizer } from "natural";

export const calculateScore = (input: string[], mappings: Mappings): number => {
  let score = 0;

  input.forEach((token) => {
    if (mappings[token]) {
      score += mappings[token];
    }
  });

  return score;
};
