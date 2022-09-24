import { socket, messages } from "../lib/stores/socket";
import type { IO } from "../declarations/main";

export const getSocket = async () => {
  const script = document.createElement("script");
  script.src = "/socket.io/socket.io.js";
  document.head.appendChild(script);

  script.onload = () => {
    const io = (window as any).io;
    const client = io() as IO;
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
    });
    return {
      connected: true,
      socket,
    };
  } catch (err) {
    console.error(err);
  }
};
