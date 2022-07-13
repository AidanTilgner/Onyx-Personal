import { calculateScore } from "../helpers";
import { Types, QuerySubtypes } from "../index.d";
import { querySubtypeMatch } from "./types";
import typesJSON from "./type.json";

const types: Types = typesJSON;

export const findQueryType = (
  input: string[]
): { name: string; functionName: string } => {
  const typesArr = Object.keys(types).map((t) => types[t]);
  const scores: number[] = [];

  typesArr.forEach((t) => {
    const score = calculateScore(input, t.words);
    scores.push(score);
  });

  const type = types[getMaxElementIndex(scores)];

  return {
    name: type.name,
    functionName: getQuerySubtype(input, querySubtypeMatch[type.name]).name,
  };
};

const getQuerySubtype = (
  input: string[],
  types: QuerySubtypes
): { name: string } => {
  const typesArr = Object.keys(types).map((t) => types[t]);
  const scores: number[] = [];

  typesArr.forEach((t) => {
    const score = calculateScore(input, t.words);
    scores.push(score);
  });

  const type = types[getMaxElementIndex(scores)];

  return { name: type.name };
};

const getMaxElementIndex = (nums: number[]): number => {
  const min = Math.max();
  const index = nums.indexOf(min);
  return index;
};
