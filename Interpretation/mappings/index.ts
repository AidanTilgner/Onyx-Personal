import typesJSON from "./intitial.json";
import { calculateScore, getMaxElementIndex } from "./helpers";
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
  if (!type) {
    console.error("No type");
    return {
      type: "not found",
      subType: "not found",
      functionName: "not found",
    };
  }
  const subType = checkMappings[type](tokenized);
  if (!subType) {
    console.error("No subType");
    return {
      type: type,
      subType: "not found",
      functionName: "not found",
    };
  }

  const result = {
    type: type,
    subType: subType.name,
    functionName: subType.functionName,
  };

  return result;
};

const findType = (input: string[]): string => {
  const types: Types = typesJSON;

  const typesArr = Object.keys(types).map((t) => types[t]);
  const scores: number[] = [];

  typesArr.forEach((t) => {
    const score = calculateScore(input, t.words);
    scores.push(score);
  });

  const type = typesArr[getMaxElementIndex(scores)];
  return type ? type.name : "";
};

// ! Tests
console.assert(
  getInputMapping("What is the weather today?").type === "query",
  "Checking Mapping Type"
);
console.assert(
  getInputMapping("What is the weather today?").subType === "weather",
  "Checking Mapping SubType"
);
console.assert(
  getInputMapping("What is the weather today?").functionName ===
    "get_weather_by_time_of_day",
  "Checking Mapping Function Name"
);
