import { console_messages } from "../../../stores/socket";

export const clearConsole = () => {
  console_messages.set([]);
  return null;
};

export default {
  clear: clearConsole,
};
