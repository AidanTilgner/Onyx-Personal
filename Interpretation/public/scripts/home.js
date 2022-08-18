import { setAlert } from "./display.js";
const TestingInput = document.getElementById("testing-input");
const TestingSubmit = document.getElementById("testing-submit");
const TestingOutput = document.getElementById("testing-output");
const TestingAction = document.getElementById("testing-action");
const TestingIntent = document.getElementById("testing-intent");
const TestingResponse = document.getElementById("testing-response");

const state = {
  input: TestingInput.value,
};

TestingInput.onkeyup = () => {
  state.input = TestingInput.value;
};

const checkDisplayProperties = () => {
  const OutputProperties = document.querySelectorAll(".output-property");
  OutputProperties.forEach((property) => {
    if (!state[property.dataset.state]) {
      property.style.display = "none";
      return;
    }
    property.style.display = "flex";
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
      console.log("Response:", res.data);
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
  TestingOutput.innerHTML = nlu.nlu_response;
  TestingIntent.innerHTML = `<strong>Intent</strong>: ${nlu.intent}`;
  TestingAction.innerHTML = `<strong>Action</strong>: ${nlu.action}`;
  TestingResponse.innerHTML = `<strong>Response</strong>: ${nlu.nlu_response}`;
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
          const { value } = input;
          axios
            .put("/training/intent", {
              text: state.input,
              intent: value,
            })
            .then((res) => {
              setAlert(res.data.message, "success");
              EditInputGroup.remove();
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
          const { value } = input;
          axios
            .put("/training/action", {
              intent: state.intent,
              action: value,
            })
            .then((res) => {
              setAlert(res.data.message, "success");
              EditInputGroup.remove();
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

const addPropertyEventListeners = () => {
  const EditIntent = document.getElementById("edit-intent");
  EditIntent.onclick = handleEditIntentClick;

  const EditAction = document.getElementById("edit-action");
  EditAction.onclick = handleEditActionClick;
};
