import { socket, messages, voice_response } from "../lib/stores/socket";

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
        console.log(message);
        messages.update((messages) => [...messages, message]);
      });
      io.on("voice_response", (response) => {
        console.log(response);
        voice_response.set(response);
      });
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};
