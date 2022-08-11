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
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export const emitMessage = (key: string, message: string) => {
  io.emit(key, message);
};
