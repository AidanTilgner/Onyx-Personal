import typesJSON from "./intitial.json";
import { calculateScore } from "./helpers";
import { WordTokenizer } from "natural";
import { findQueryType } from "./queries/index";
import { findCommandType } from "./commands/index";
import { Result, Types } from "./index.d";

const checkMappings: { [key: string]: Function } = {
  query: findQueryType,
  command: findCommandType,
};

export const getInputMapping = (input: string): Result => {
  const tokenized = new WordTokenizer().tokenize(input);
  const type = findType(tokenized);
  const subType = checkMappings[type](input);

  const result = {
    type: type,
    subType: subType.name,
    functionName: subType.functionName,
  };

  return result;
};

const types: Types = typesJSON;

const findType = (input: string[]): string => {
  const typesArr = Object.keys(types).map((t) => types[t]);
  const scores: number[] = [];

  typesArr.forEach((t) => {
    const score = calculateScore(input, t.words);
    scores.push(score);
  });

  const type = types[getMaxElementIndex(scores)];

  return type.name;
};

const getMaxElementIndex = (nums: number[]): number => {
  const min = Math.max();
  const index = nums.indexOf(min);
  return index;
};

console.log("Test: ", getInputMapping("What is the weather today?"));
