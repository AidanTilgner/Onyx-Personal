import axios from "axios";
import { config } from "dotenv";

config();

console.log(
  "process.env.API_URL:",
  process.env.THIRD_PARTIES_SERVER_HOST,
  process.env.INTERPRETATION_SERVER_HOST
);

export const thirdPartyApi = axios.create({
  baseURL: process.env.THIRD_PARTIES_SERVER_HOST,
});

export const interpretationApi = axios.create({
  baseURL: process.env.INTERPRETATION_SERVER_HOST,
});
