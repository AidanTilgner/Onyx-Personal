import { display_action_output, voice_response } from "./display";

const mappings: { [key: string]: Function } = {
  display_action_output: display_action_output,
  voice_response: voice_response,
};

export default mappings;
