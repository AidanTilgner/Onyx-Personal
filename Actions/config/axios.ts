import axios from "axios";

export const thirdPartyApi = axios.create({
  baseURL: "http://localhost:5004/",
});
