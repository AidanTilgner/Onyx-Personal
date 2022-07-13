import { calculateScore } from "../helpers";
import { Types, QuerySubtypes } from "../index.d";
import { querySubtypeMatch } from "./types";
import typesJSON from "./type.json";
import { getMaxElementIndex } from "../helpers";

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

  const type = typesArr[getMaxElementIndex(scores)];

  return {
    name: type.name,
    functionName: getQuerySubtype(input, querySubtypeMatch[type.name]).func
      .name,
  };
};

const getQuerySubtype = (
  input: string[],
  types: QuerySubtypes
): { name: string; func: { name: string } } => {
  const typesArr = Object.keys(types).map((t) => types[t]);
  const scores: number[] = [];

  typesArr.forEach((t) => {
    const score = calculateScore(input, t.words);
    scores.push(score);
  });

  const type = typesArr[getMaxElementIndex(scores)];

  return { name: type.name, func: type.func };
};
