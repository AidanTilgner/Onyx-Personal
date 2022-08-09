import { Server } from "socket.io";

export const initIO = (io: Server) => {
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
