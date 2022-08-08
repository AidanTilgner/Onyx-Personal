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
    return data;
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
