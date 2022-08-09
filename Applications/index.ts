import express from "express";
import path from "path";
import { Request, Response } from "./index.d";
import proxyRouter from "./routes/proxy";
import packagesRouter from "./routes/packages";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { initIO } from "./config/socket-io";
const app = express();
const server = createServer(app);
const io = new Server(server);

config();
initIO(io);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/home", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "home/index.html"));
});

app.use("/package-hook", packagesRouter);
app.use("/proxy", proxyRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
