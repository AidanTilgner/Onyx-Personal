import { fetchApi } from "../fetch";

const dispatchCommand = (command, ...args) => {
  switch (args[0]) {
    case "action":
      return dispatchAction(command, ...args);
    default:
      return;
  }
};

export default dispatchCommand;

const dispatchAction = async (command, ...args) => {
  try {
    const [command, action, ...rest] = args;
    const formattedEntities = {};
    rest.forEach((entity) => {
      const [key, value] = entity.split(":");
      formattedEntities[key] = value;
    });
    const response = await fetchApi(`/api/proxy/actions/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedEntities),
    });
    return [response.message, response.response];
  } catch (err) {
    console.error(err);
  }
};
