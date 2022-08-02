import weatherMappings from "../actions/weather";

const mappings: { [key: string]: Function } = {
  get_weather_by_time_of_day: weatherMappings["get_weather_by_time_of_day"],
};

export default mappings;
