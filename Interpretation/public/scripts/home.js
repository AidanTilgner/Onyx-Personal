import { setAlert } from "./display.js";
import { getTrainingData } from "./main.js";
const TestingInput = document.getElementById("testing-input");
const TestingSubmit = document.getElementById("testing-submit");
const TestingOutput = document.getElementById("testing-output");
const TestingAction = document.getElementById("testing-action");
const TestingIntent = document.getElementById("testing-intent");
const TestingResponse = document.getElementById("testing-response");
const TestingResponses = document.getElementById("testing-responses");

const state = {
  input: TestingInput.value,
  intent: "",
  action: "",
  nlu_response: "",
  responses: [],
  intents: [],
  currentTooltip: null,
};

(async () => {
  try {
    const training = await getTrainingData();
    if (training.data.error) {
      setAlert(training.data.error, "danger");
      return;
    }
    state.intents = training.data.intents;
  } catch (err) {
    console.log(err);
    setAlert(
      "Error getting training data, check console for more info.",
      "danger"
    );
  }
})();

TestingInput.onkeyup = () => {
  state.input = TestingInput.value;
};

const checkDisplayProperties = () => {
  const OutputProperties = document.querySelectorAll(".output-property");
  const OutputLists = document.querySelectorAll(".output-list");
  OutputProperties.forEach((property) => {
    if (!state[property.dataset.state]) {
      property.style.display = "none";
      return;
    }
    property.style.display = "flex";
  });
  OutputLists.forEach((list) => {
    if (!state[list.dataset.state]?.length) {
      list.style.display = "none";
      return;
    }
    list.style.display = "flex";
  });
};
checkDisplayProperties();

const checkDisplayOutput = () => {
  if (TestingOutput.innerHTML.length > 0) {
    TestingOutput.style.display = "flex";
  } else {
    TestingOutput.style.display = "none";
  }
};
checkDisplayOutput();

const getNLUForInput = async () => {
  const { nlu } = await axios
    .post("/nlu", {
      text: state.input,
    })
    .then((res) => {
      if (res.data.error) {
        setAlert(res.data.error, "danger");
        return;
      }
      return res.data;
    })
    .catch((err) => {
      console.log("Error:", err);
      setAlert(
        "Error getting NLU response, check console for more info.",
        "danger"
      );
    });
  state.intent = nlu.intent;
  state.nlu_response = nlu.nlu_response;
  state.action = nlu.action;
  state.responses = nlu.responses;
  TestingOutput.innerHTML = nlu.nlu_response;
  TestingIntent.innerHTML = `<strong>Intent:</strong> ${nlu.intent}`;
  TestingAction.innerHTML = `<strong>Action:</strong> ${nlu.action}`;
  TestingResponse.innerHTML = `<strong>Response:</strong> ${nlu.nlu_response}`;
  TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p>`;
  nlu.responses.forEach((response) => {
    const responseItem = document.createElement("span");
    responseItem.classList.add("output-list-item", "possible-response");
    responseItem.setAttribute("title", "Replace current response");
    responseItem.innerHTML = response;
    TestingResponses.appendChild(responseItem);
  });
  checkDisplayOutput();
  checkDisplayProperties();
  addPropertyEventListeners();
  return nlu;
};

TestingSubmit.addEventListener("click", getNLUForInput);
// Testing Input should also call getNLUForInput when enter is pressed.
TestingInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getNLUForInput();
  }
});

const createEditInputGroup = ({
  placeholder = "Enter text",
  value = "",
  buttons,
}) => {
  const EditInputGroup = document.createElement("div");
  EditInputGroup.classList.add("output-edit-property");
  const input = document.createElement("input");
  input.value = value;
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", placeholder);
  input.classList.add("output-edit-property__input");
  EditInputGroup.appendChild(input);
  const icons = document.createElement("div");
  icons.classList.add("output-edit-property__icons");
  buttons.forEach((button) => {
    const icon = document.createElement("i");
    icon.classList.add("material-symbols-outlined");
    icon.classList.add(button.type);
    icon.title = button.title;
    icon.innerHTML = button.icon;
    icon.onclick = button.action;
    icons.appendChild(icon);

    if (button.type === "primary") {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          button.action();
        }
      });
    }
  });
  EditInputGroup.appendChild(icons);

  return {
    EditInputGroup,
    input,
    icons,
  };
};

const handleEditIntentClick = (e) => {
  e.preventDefault();
  const { EditInputGroup, input, icons } = createEditInputGroup({
    placeholder: "Enter the correct intent",
    value: state.intent,
    buttons: [
      {
        title: "Cancel",
        icon: "cancel",
        type: "danger",
        action: () => {
          EditInputGroup.remove();
          TestingIntentContainer.style.display = "flex";
        },
      },
      {
        title: "Submit new intent",
        icon: "check",
        type: "primary",
        action: () => {
          const confirmed = confirm(
            `Are you sure? This will change the intent to ${input.value} for the text "${state.input}".`
          );
          if (!confirmed) {
            return;
          }
          const { value } = input;
          EditInputGroup.remove();
          TestingIntentContainer.style.display = "flex";
          state.intent = value;
          TestingIntent.innerHTML = `<strong>Intent:</strong> ${value}`;
          TestingAction.innerHTML = `<strong>Action:</strong> loading...`;
          TestingResponse.innerHTML = `<strong>Response:</strong> loading...`;
          TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p><span class="output-list-item">loading...</span>`;

          axios
            .put("/training/intent", {
              text: state.input,
              intent: value,
            })
            .then((res) => {
              if (res.data.error) {
                setAlert(res.data.error, "danger");
                return;
              }
              setAlert(res.data.message, "success");
              getNLUForInput();
            })
            .catch((err) => {
              console.log("Error:", err);
              setAlert(err.response.data.error, "danger");
            });
        },
      },
    ],
  });
  const OutputProperties = document.getElementById("testing-properties");
  const TestingIntentContainer = document.getElementById(
    "testing-intent-container"
  );
  // Set display none on testing-intent and make EditInputGroup the first child of testing-properties.
  TestingIntentContainer.style.display = "none";
  OutputProperties.insertBefore(EditInputGroup, TestingIntentContainer);
  input.focus();

  // every keypress, search the state.intents for the closests 5 intents by levenshtein distance.
  input.addEventListener("keyup", (e) => {
    const closest = state.intents
      .sort((a, b) => {
        return (
          getLevenshteinDistance(a, e.target.value) -
          getLevenshteinDistance(b, e.target.value)
        );
      })
      .slice(0, 5);
    state.currentTooltip?.remove();
    const tooltip = document.createElement("div");
    state.currentTooltip = tooltip;
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = `<p><strong>Similar Intents:</strong> ${closest
      .map(
        (intent, idx) =>
          `${
            idx ? "," : ""
          } <span class="similar-intent" title="Select this intent">${intent}</span>`
      )
      .join("")}</p>`;
    EditInputGroup.appendChild(tooltip);
    document.querySelectorAll(".similar-intent").forEach((intent) => {
      intent.addEventListener("click", (e) => {
        input.value = e.target.innerHTML;
        state.currentTooltip.remove();
      });
    });
  });
};

const handleEditActionClick = (e) => {
  e.preventDefault();
  const TestingActionContainer = document.getElementById(
    "testing-action-container"
  );
  const { EditInputGroup, input, icons } = createEditInputGroup({
    placeholder: "Enter the correct action for this intent",
    value: state.action,
    buttons: [
      {
        title: "Cancel",
        icon: "cancel",
        type: "danger",
        action: () => {
          EditInputGroup.remove();
          TestingActionContainer.style.display = "flex";
        },
      },
      {
        title: "Submit new action",
        icon: "check",
        type: "primary",
        action: () => {
          const confirmed = confirm(
            `Are you sure? This will change the action of the intent "${state.intent}" to "${input.value}".`
          );
          if (!confirmed) {
            return;
          }
          const { value } = input;
          EditInputGroup.remove();
          TestingActionContainer.style.display = "flex";
          TestingAction.innerHTML = `<strong>Action:</strong> ${value}`;
          TestingResponse.innerHTML = `<strong>Response:</strong> loading...`;
          TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p><span class="output-list-item">loading...</span>`;
          state.action = value;

          axios
            .put("/training/action", {
              intent: state.intent,
              action: value,
            })
            .then((res) => {
              if (res.data.error) {
                setAlert(res.data.error, "danger");
                return;
              }
              setAlert(res.data.message, "success");
              getNLUForInput();
            })
            .catch((err) => {
              console.log("Error:", err);
              setAlert(err.response.data.error, "danger");
            });
        },
      },
    ],
  });
  const OutputProperties = document.getElementById("testing-properties");
  // Set display none on testing-intent and make EditInputGroup the first child of testing-properties.
  TestingActionContainer.style.display = "none";
  OutputProperties.insertBefore(EditInputGroup, TestingActionContainer);
  input.focus();
};

const handleRemoveResponseClick = (e) => {
  e.preventDefault();
  if (state.nlu_response === "custom_message") {
    alert(
      "You can't remove the custom message default. Adding a new message will replace the custom message."
    );
    return;
  }
  const confirmed = confirm("Are you sure you want to remove this response?");
  if (!confirmed) {
    return;
  }
  state.responses = state.responses.filter((res) => {
    res !== state.nlu_response;
  });
  TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p><span class="output-list-item">loading...</span>`;
  TestingResponse.innerHTML = `<strong>Response</strong> loading...`;

  axios
    .delete("/training/response", {
      data: {
        action: state.action,
        response: state.nlu_response,
      },
    })
    .then((res) => {
      if (res.data.error) {
        setAlert(res.data.error, "danger");
        return;
      }
      setAlert(res.data.message, "success");
      getNLUForInput();
    })
    .catch((err) => {
      console.log("Error:", err);
      setAlert(err.response.data.error, "danger");
    });
};

const handleAddResponseClick = (e) => {
  e.preventDefault();
  const { EditInputGroup, input, icons } = createEditInputGroup({
    placeholder: "Enter the new response",
    value: "",
    buttons: [
      {
        title: "Cancel",
        icon: "cancel",
        type: "danger",
        action: () => {
          EditInputGroup.remove();
          TestingResponseContainer.style.display = "flex";
        },
      },
      {
        title: "Submit new response",
        icon: "check",
        type: "primary",
        action: () => {
          const confirmed = confirm(
            `Are you sure? This will add the response "${input.value}" to the action "${state.action}".`
          );
          if (!confirmed) {
            return;
          }
          const { value } = input;
          state.responses.push(value);
          TestingResponses.innerHTML += `<span class="output-list-item">${value}</span>`;
          axios
            .post("/training/response", {
              action: state.action,
              response: value,
            })
            .then((res) => {
              if (res.data.error) {
                setAlert(res.data.error, "danger");
                return;
              }
              setAlert(res.data.message, "success");
              EditInputGroup.remove();
              TestingResponseContainer.style.display = "flex";
              getNLUForInput();
            })
            .catch((err) => {
              console.log("Error:", err);
              setAlert(err.response.data.error, "danger");
            });
        },
      },
    ],
  });
  const OutputProperties = document.getElementById("testing-properties");
  const TestingResponseContainer = document.getElementById(
    "testing-response-container"
  );
  // Set display none on testing-intent and make EditInputGroup the first child of testing-properties.
  TestingResponseContainer.style.display = "none";
  OutputProperties.insertBefore(EditInputGroup, TestingResponseContainer);
  input.focus();
};

const onPossibleResponseClick = (e) => {
  e.preventDefault();
  TestingResponse.innerHTML = `<strong>Response</strong>: ${e.target.innerText}`;
  state.nlu_response = e.target.innerText;
};

const addPropertyEventListeners = () => {
  const EditIntent = document.getElementById("edit-intent");
  EditIntent.onclick = handleEditIntentClick;

  const EditAction = document.getElementById("edit-action");
  EditAction.onclick = handleEditActionClick;

  const RemoveResponse = document.getElementById("remove-response");
  RemoveResponse.onclick = handleRemoveResponseClick;

  const AddResponse = document.getElementById("add-response");
  AddResponse.onclick = handleAddResponseClick;

  const PossibleResponses = document.querySelectorAll(".possible-response");
  PossibleResponses.forEach((poss) => {
    poss.onclick = onPossibleResponseClick;
  });
};

const getLevenshteinDistance = (a, b) => {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};
