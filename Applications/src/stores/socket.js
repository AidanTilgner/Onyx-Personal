import { writable } from "svelte/store";

export const socket = new writable(null);
export const messages = new writable([]);
