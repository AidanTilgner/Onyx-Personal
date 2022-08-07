import { thirdPartyApi } from "../../config/axios";

const getWeather = async (city: string) => {
  try {
    if (!city) {
      city = "Salem,OR,US";
    }
    console.log("Getting weather for", city);
    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
      };
    }
    console.log("Got Weather:", data);
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
};
