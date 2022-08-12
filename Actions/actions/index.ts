import weatherMappings from "./types/weather";

const mappings: { [key: string]: Function } = {
  get_weather: weatherMappings["get_weather"],
  get_weather_from_nlu: weatherMappings["get_weather_from_nlu"],
};

export default mappings;
