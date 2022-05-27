const TEXT_INPUT = document.getElementById("onyx-input");

TEXT_INPUT.addEventListener("keypress", (e) => {
  // If enter, submit
  if (e.key !== "Enter") return;
  alert(TEXT_INPUT.value);
});
