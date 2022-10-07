import axios from "axios";
import { config } from "dotenv";

config();

export const actionServer = axios.create({
  baseURL: process.env.ACTION_SERVER_HOST,
});

export const interpretationServer = axios.create({
  baseURL: process.env.INTERPRETATION_SERVER_HOST,
});

export const peopleServer = axios.create({
  baseURL: process.env.PEOPLE_SERVER_HOST,
});
