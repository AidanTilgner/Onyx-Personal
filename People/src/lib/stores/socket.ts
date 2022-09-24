import { writable, derived } from "svelte/store";
import type { IO } from "../../declarations/main";

export const socket = writable<IO>(null);
export const messages = writable<string[]>([]);
export const currentMessage = derived(
  messages,
  ($messages) => {
    return $messages[$messages.length - 1];
  },
  ""
);
