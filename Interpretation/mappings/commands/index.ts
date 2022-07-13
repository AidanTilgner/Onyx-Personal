import { calculateScore } from "../helpers";
import { CommandSubtypes, Types } from "../index.d";
import { commandSubtypeMatch } from "./types";
import typesJSON from "./type.json";

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

  const type = types[getMaxElementIndex(scores)];

  return {
    name: type.name,
    functionName: getCommandSubtype(input, commandSubtypeMatch[type.name]).name,
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

  const type = types[getMaxElementIndex(scores)];

  return { name: type.name, func: type.func };
};

const getMaxElementIndex = (nums: number[]): number => {
  const min = Math.max();
  const index = nums.indexOf(min);
  return index;
};
