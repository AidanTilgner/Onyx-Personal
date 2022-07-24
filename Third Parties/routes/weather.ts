import { Router } from "express";
import axios from "axios";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?q=London&appid=b6907d289e10d714a6e88b30761fae22"
    );
    res.send(data);
  } catch (err) {
    console.log("Error fetching weather data", err);
    return {
      error: "Error fetching weather data",
    };
  }
});

export default router;
