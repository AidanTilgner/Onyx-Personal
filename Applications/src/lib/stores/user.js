import { writable } from "svelte/store";

export const user = new writable({
  first_name: "Aidan",
  last_name: "Tilgner",
});
