import express from "express";
import path from "path";
import { Request, Response } from "./index.d";
import proxyRouter from "./routes/proxy";
import packagesRouter from "./routes/packages";
import dashboardRouter from "./routes/dashboard";
import cors from "cors";
import { config } from "dotenv";
import { createServer } from "http";
import { initIO } from "./utils/socket-io";
const app = express();
const server = createServer(app);

config();
initIO(server);

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
app.use("/dashboard", dashboardRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
