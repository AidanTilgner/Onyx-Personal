import { console_messages } from "../../stores/socket";

export const dispatch = (command, ...args) => {
  console.log("dispatch", "command", args);
  if (command === "clear") {
    console_messages.set([]);
  }
};
