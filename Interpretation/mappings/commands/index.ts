import { calculateScore } from "../helpers";
import { CommandSubtypes, Types } from "../index.d";
import { commandSubtypeMatch } from "./types";
import typesJSON from "./type.json";
import { getMaxElementIndex } from "../helpers";

const types: Types = typesJSON;

export const findCommandType = (
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
    functionName: getCommandSubtype(input, commandSubtypeMatch[type.name]).func
      .name,
  };
};

const getCommandSubtype = (
  input: string[],
  types: CommandSubtypes
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
