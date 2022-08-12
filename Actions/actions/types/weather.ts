import { thirdPartyApi } from "../../config/axios";
import { MetaData } from "../../definitions/misc";

const getWeather = async (city: string) => {
  try {
    if (!city) {
      city = "Salem,OR,US";
    }
    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
      };
    }
    return data;
  } catch (err) {
    console.log("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
    };
  }
};

export const getWeatherFromNlu = async (nlu: MetaData) => {
  try {
    let city = "Salem,OR,US";

    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
      };
    }
    const message = `The weather in ${city} is "${data.data.weather[0].description}" with a temperature of ${data.data.main.temp} degrees.`;
    console.log("Weather data:", {
      data: data.data.main,
      display_type: "weather",
      custom_message: message,
    });
    return { data, display_type: "weather", custom_message: message };
  } catch (err) {
    console.log("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
    };
  }
};

export default {
  get_weather: getWeather,
  get_weather_from_nlu: getWeatherFromNlu,
};
