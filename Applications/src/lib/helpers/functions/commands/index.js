import { console_messages } from "../../../stores/socket";
import { history } from "../../../stores/commands";
import dispatchCommand from "./dispatch";
import generalCommands from "./general";
import nluCommand from "./nlu";

export const dispatch = async (command, ...args) => {
  if (!commandMappings[command]) {
    console_messages.update((messages) => [
      ...messages,
      `Command "${command}" not found`,
    ]);
    return;
  }
  history.update((history) => [...history, `${command} ${args.join(" ")}`]);
  const response = await commandMappings[command](command, ...args);
  console_messages.update((messages) => {
    if (!response) {
      return messages;
    }
    return [...messages, ...response];
  });
};

const commandMappings = {
  ...generalCommands,
  dispatch: dispatchCommand,
  nlu: nluCommand,
};
