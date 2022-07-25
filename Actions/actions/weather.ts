import { thirdPartyApi } from "../config/axios";

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

export default {
  get_weather_by_location: getWeather,
};
