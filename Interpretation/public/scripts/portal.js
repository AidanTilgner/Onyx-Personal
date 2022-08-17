import { setAlert } from "./display.js";

const trainingData = axios.get("/training/").then((res) => {
  console.log("Data:", res.data);
  if (res.data.error) {
    setAlert(res.data.error, "danger");
    return null;
  }
  //   setAlert(res.data.message, "success");
  return res.data;
});
