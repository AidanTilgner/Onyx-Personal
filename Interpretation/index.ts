import Express, { json, urlencoded } from "express";
import { config } from "dotenv";
import nluRouter from "./routes/nlu";
import packagesRouter from "./routes/packages";
import trainingRouter from "./routes/training";
import path from "path";

config();

const app = Express();

const PORT = process.env.PORT || 5001;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(Express.static(path.join(__dirname, "public")));

app.use("/nlu", nluRouter);
app.use("/package-hook", packagesRouter);
app.use("/training", trainingRouter);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
