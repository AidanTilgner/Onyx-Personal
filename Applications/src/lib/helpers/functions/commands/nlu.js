import { fetchApi } from "../fetch";

const nluCommand = async (command, ...args) => {
  try {
    const [type, ...rest] = args;

    switch (type) {
      case "say":
        return sayCommand(command, ...rest);
      case "test":
        return testNlu();
      default:
        return [`"${type}" not recognized as a valid NLU command`];
    }
  } catch (err) {
    console.error(err);
  }
};

export default nluCommand;

const testNlu = async () => {
  try {
    // test that nlu server is running by pinging it with a request
    // set a timeout of 5 seconds which will throw an error if the server doesn't respond
    const response = await fetchApi(`/api/proxy/nlu/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "test",
      }),
    });
    const {
      nlu: { nlu_response, responses },
      error,
    } = response;
    if (error) {
      return [error];
    }
    return ["NLU server is running"];
  } catch (err) {
    console.error(err);
    return ["NLU Server is not running."];
  }
};

const sayCommand = async (command, ...args) => {
  try {
    const text = args.join(" ");
    const response = await fetchApi(`/api/proxy/nlu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });
    const {
      nlu: { nlu_response, responses },
      error,
    } = response;
    if (error) {
      return [error];
    }
    if (!nlu_response.length) {
      const botMessage = responses.join(" ");
      return [`You: ${text}`, `Onyx: ${botMessage}`];
    }
    return [`You: ${text}`, `Onyx: ${nlu_response}`];
  } catch (err) {
    console.error(err);
    return [err];
  }
};
