import types from "./type.json";
import { calculateScore } from "../../extraction/extract";

const findType = (input: string[]): string => {
  const scores = [];
  Object.keys(types).forEach((type) => {
    scores[type] = 0;
  });

  return "";
};
