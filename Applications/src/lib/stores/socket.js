import { writable, derived } from "svelte/store";

export const socket = new writable(null);
export const messages = new writable([]);
export const currentMessage = new derived(
  messages,
  ($messages) => {
    return $messages[$messages.length - 1];
  },
  ""
);
export const console_messages = new writable([]);

export const voice_response = new writable(null);
