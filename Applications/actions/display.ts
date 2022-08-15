import { emitMessage } from "../utils/socket-io";

export const display_action_output = (out: any) => {
  if (out.display_type) {
    display_type_mappings[out.display_type](out);
    return;
  }
  console.log("Output:", JSON.stringify(out));
  emitMessage("message", JSON.stringify(out));
};

const display_weather_data = ({
  data,
  custom_message,
}: {
  data: any;
  custom_message: string;
}) => {
  console.log("Weather data:", JSON.stringify(data.data.weather));
  const toSend = {
    weather: data.data.weather,
    custom_message: custom_message,
  };
  emitMessage("message", JSON.stringify(toSend));
};

export const voice_response = ({
  data,
  custom_message,
}: {
  data: any;
  custom_message: string;
}) => {
  console.log("Voice response:", JSON.stringify(data.data.voice));
  const toSend = {
    voice: data.data.voice,
    custom_message: custom_message,
  };
  emitMessage("voice_response", JSON.stringify(toSend));
};

const display_type_mappings: { [key: string]: Function } = {
  weather: display_weather_data,
};
