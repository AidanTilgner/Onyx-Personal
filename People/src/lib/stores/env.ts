import { writable } from "svelte/store";

export const currentPath = writable<string>(window.location.pathname);
