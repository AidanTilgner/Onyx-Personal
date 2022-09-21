import { console_messages } from "../../stores/socket";

export const dispatch = (command, ...args) => {
  return commandMappings[command](command, ...args);
};

const clearConsole = () => {
  console_messages.set([]);
};

const dispatchCommand = (command, ...args) => {
  console.log("Dispatching command", command, args);
  switch (args[0]) {
    case "action":
      return dispatchAction(command, [args[1]]);
    default:
      return;
  }
};

const dispatchAction = async (command, ...args) => {
  try {
    const response = await fetch(`/api/proxy/actions/${args[0]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
      });
    console_messages.update((messages) => [
      ...messages,
      response.message,
      response.response,
    ]);
    return response;
  } catch (err) {
    console.error(err);
  }
};

const commandMappings = {
  dispatch: dispatchCommand,
  clear: clearConsole,
};
