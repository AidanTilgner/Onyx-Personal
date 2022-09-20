import { globalLog } from "../utils/logger";
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
  const toSend = {
    weather: data.data.weather,
    custom_message: custom_message,
  };
  emitMessage("message", JSON.stringify(toSend));
  globalLog("Weather Data:", toSend);
};

export const voice_response = ({
  custom_message,
  data,
}: {
  custom_message: string;
  data: any;
}) => {
  if (custom_message === "custom_message") {
    custom_message =
      "Oops. It looks like I understand what you're saying, but I have no action to perform for that yet.";
    globalLog(
      "Voice Data",
      "It looks like this voice response is understood, but there is no action associated with it.",
      { ...data }
    );
  }
  const toSend = {
    custom_message: custom_message,
    data: data ? data : null,
    initial_input: data.initial_input,
  };
  emitMessage("voice_response", JSON.stringify(toSend));
  globalLog("Voice Data", { ...toSend });
};

const display_type_mappings: { [key: string]: Function } = {
  weather: display_weather_data,
};
