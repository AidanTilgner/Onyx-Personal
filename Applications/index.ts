import express from "express";
import path from "path";
import { Request, Response } from "./index.d";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/home", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "home/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
