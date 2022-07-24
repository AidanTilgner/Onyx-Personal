import express from "express";
import path from "path";
import { Request, Response } from "./index.d";
import weatherRouter from "./routes/weather";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/weather", weatherRouter);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
