import { getTrainingData } from "./main.js";
import { setAlert } from "./display.js";
const ActionsList = document.getElementById("actions-list");
const SearchInput = document.getElementById("search-input");
const SearchButton = document.getElementById("search-button");

const data = await getTrainingData();
if (data.error) {
  setAlert(data.error, "danger");
}
console.log("Data:", data);
let actionsObject = data.data.intent_to_action;
// actionsObject schema:
// {
//     [action: string]: {
//         [subaction: string]: {
//             [type: string | "default"]: string
//         }
//     },
// }
// This is the schema. Now we have to make this into an element structure of lists, and append that to ActionsList.

Object.keys(actionsObject).forEach((action) => {
  const actionElement = document.createElement("ul");
  actionElement.classList.add("action");
  actionElement.innerHTML = `<li class="action__name">${action}</li>`;
  ActionsList.appendChild(actionElement);
  Object.keys(actionsObject[action]).forEach((subaction) => {
    const subactionElement = document.createElement("ul");
    subactionElement.classList.add("subaction");
    subactionElement.innerHTML = `<li class="subaction__name">${subaction}</li>`;
    actionElement.appendChild(subactionElement);
    Object.keys(actionsObject[action][subaction]).forEach((type) => {
      const typeElement = document.createElement("ul");
      typeElement.classList.add("type");
      typeElement.innerHTML = `<li class="type__name">${type}</li>`;
      subactionElement.appendChild(typeElement);
      const typeValueElement = document.createElement("ul");
      typeValueElement.classList.add("type-value");
      typeValueElement.innerHTML = `<li class="type-value__name">${actionsObject[action][subaction][type]}</li>`;
      typeElement.appendChild(typeValueElement);
    });
  });
});

const filterExamples = (e) => {
  const filter = SearchInput.value.toLowerCase();
  const actionElements = document.getElementsByClassName("action");
  const subactionElements =
    document.getElementsByClassName("action__subaction");
  const typeElements = document.getElementsByClassName("action__type");

  Array.from(actionElements).forEach((action) => {
    if (action.innerText.toLowerCase().includes(filter)) {
      action.style.display = "flex";
    } else {
      action.style.display = "none";
    }
  });

  Array.from(subactionElements).forEach((subaction) => {
    if (subaction.innerText.toLowerCase().includes(filter)) {
      subaction.style.display = "flex";
    } else {
      subaction.style.display = "none";
    }
  });

  Array.from(typeElements).forEach((type) => {
    if (type.innerText.toLowerCase().includes(filter)) {
      type.style.display = "flex";
    } else {
      type.style.display = "none";
    }
  });
};

SearchInput.addEventListener("keyup", filterExamples);
SearchButton.addEventListener("click", filterExamples);
