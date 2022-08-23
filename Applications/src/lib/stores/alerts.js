import { writable } from "svelte/store";

export const currentAlert = writable({
  title: "",
  message: "",
  type: "",
  show: false,
  timeout: 4000,
});
