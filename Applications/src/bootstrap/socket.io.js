import {
  socket,
  messages,
  voice_response,
  console_messages,
} from "../lib/stores/socket";

export const getSocket = async () => {
  const script = document.createElement("script");
  script.src = "/socket.io/socket.io.js";
  document.head.appendChild(script);

  script.onload = () => {
    const client = io();
    socket.set(client);
  };
};

export const initSocket = async () => {
  try {
    await getSocket();
    socket.subscribe((io) => {
      if (!io) {
        return;
      }
      io.on("connect", () => {
        console.log("connected");
      });
      io.on("message", (message) => {
        messages.update((messages) => [...messages, message]);
      });
      io.on("voice_response", (response) => {
        voice_response.set(response);
      });
      io.on("console_message", (...args) => {
        console_messages.update((messages) => [...messages, args]);
      });
    });
    return true;
  } catch (err) {
    console.error(err);
  }
};
