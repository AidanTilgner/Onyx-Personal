import { Server as SocketIOServer } from "socket.io";
import http from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./socket-io.d";

let io: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export const initIO = (server: http.Server) => {
  io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit(
      "message",
      "Welcome to the Onyx Applications Server. Socket.io is successfully initilized and connected."
    );
    socket.emit(
      "console_message",
      "Welcome to the Onyx Applications Server. Socket.io is successfully initilized and connected."
    );
    socket.on("disconnect", () => {
      console.error("A user disconnected");
    });
  });
};

export const emitMessage = (key: string, message: string, ...args: any[]) => {
  io.emit(key, message, ...args);
};

export const emitArgs = (key: string, ...args: any[]) => {
  console.log("Received args:", args);
  return io.emit(key, ...args);
};
