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

export const getMaxElementIndex = (nums: number[]): number => {
  const max = Math.max(...nums);
  const index = nums.indexOf(max);
  return index;
};
