import { getTrainingData } from "./main.js";
import { setAlert } from "./display.js";
const ExamplesList = document.getElementById("examples-list");
const SearchInput = document.getElementById("search-input");
const SearchButton = document.getElementById("search-button");

const data = await getTrainingData();
if (data.error) {
  setAlert(data.error, "danger");
}
console.log("Data:", data);

data.data.text_to_intent.forEach(({ text, intent, language }) => {
  ExamplesList.innerHTML += `<ul class="example">
        <li class="example__text">${text}</li>
        <li class="example__intent">${intent}</li>
        <li class="example__language">${language}</li>
    </ul>`;
});

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
