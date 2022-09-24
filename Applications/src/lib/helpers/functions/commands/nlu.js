const nluCommand = async (command, ...args) => {
  try {
    console.log("NLU Command", command, args);
    const [type, ...rest] = args;

    switch (type) {
      case "say":
        return sayCommand(command, ...rest);
      default:
        return [`"${type}" not recognized as a valid NLU command`];
    }
  } catch (err) {
    console.error(err);
  }
};

export default nluCommand;

const sayCommand = async (command, ...args) => {
  try {
    const text = args.join(" ");
    const response = await fetch(`/api/proxy/nlu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return err;
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
