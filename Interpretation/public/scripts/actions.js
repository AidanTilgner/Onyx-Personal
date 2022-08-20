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

console.log(actions);

for (const intent in actions) {
  ActionsList.innerHTML += `<ul class="action">

        <li class="action__intent">${intent}</li>
        <ul class="action__subactions">
            ${Object.keys(actions[intent])
              .map((subaction) => {
                return `<li class="action__subaction">${subaction}</li>
                <ul class="action__types">
                    ${Object.keys(actions[intent][subaction])
                      .map((type) => {
                        return `<li class="action__type">${type}</li>
                        <li class="action__action">${actions[intent][subaction][type]}</li>`;
                      })
                      .join("")}
                </ul>`;
              })
              .join("")}
        </ul>
    </ul>`;
}

const filterExamples = (e) => {
  const filter = SearchInput.value.toLowerCase();
  const exElements = document.getElementsByClassName("example");

  Array.from(exElements).forEach((ex) => {
    if (ex.innerText.toLowerCase().includes(filter)) {
      ex.style.display = "flex";
    } else {
      ex.style.display = "none";
    }
  });
};

SearchInput.addEventListener("keyup", filterExamples);
SearchButton.addEventListener("click", filterExamples);
