import { Router } from "express";
import axios from "axios";
import { config } from "dotenv";
const router = Router();

config();

const locations = {
  home: {
    coords: {
      lat: "44.86",
      lon: "-123.01",
    },
    location: {
      city: "Salem",
      state: "OR",
      country: "US",
    },
  },
};

router.get("/", async (req, res) => {
  try {
    const env = process.env.API_KEY_OPEN_WEATHER;
    let lat, lon;
    if (req.query.lon && req.query.lat) {
      lat = req.query.lat;
      lon = req.query.lon;
    } else {
      lat = locations.home.coords.lat;
      lon = locations.home.coords.lon;
    }
    const url = req.query.location
      ? `https://api.openweathermap.org/data/2.5/weather?q=${req.query.location}&appid=${env}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env}`;

    const { data } = await axios.get(url);
    res.send({ data, message: "Successfully retrieved weather data" });
  } catch (err) {
    console.log("Error fetching weather data", err);
    return {
      error: "Error fetching weather data",
    };
  }
});

export default router;
