import weatherMappings from "../actions/weather";

const mappings: { [key: string]: Function } = {
  get_weather: weatherMappings["get_weather"],
};

export default mappings;
