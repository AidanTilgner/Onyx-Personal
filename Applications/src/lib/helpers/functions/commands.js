import { console_messages } from "../../stores/socket";
import { history } from "../../stores/commands";

export const dispatch = (command, ...args) => {
  if (!commandMappings[command]) {
    console_messages.update((messages) => [
      ...messages,
      `Command "${command}" not found`,
    ]);
    return;
  }
  history.update((history) => [...history, `${command} ${args.join(" ")}`]);
  return commandMappings[command](command, ...args);
};

const clearConsole = () => {
  console_messages.set([]);
};

const dispatchCommand = (command, ...args) => {
  switch (args[0]) {
    case "action":
      return dispatchAction(command, ...args);
    default:
      return;
  }
};

const dispatchAction = async (command, ...args) => {
  try {
    const [command, action, ...rest] = args;
    console.log("Entities", rest);
    const formattedEntities = {};
    rest.forEach((entity) => {
      console.log("Entity", entity);
      const [key, value] = entity.split(":");
      formattedEntities[key] = value;
    });
    console.log("Sending body", formattedEntities);
    const response = await fetch(`/api/proxy/actions/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedEntities),
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
