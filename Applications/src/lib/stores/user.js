import { writable } from "svelte/store";

export const user = new writable({
  first_name: "Aidan",
  last_name: "Tilgner",
});

export const loggedIn = new writable(
  localStorage.getItem("app_key") ? true : false
);
