import Express, { json, urlencoded } from "express";
import { config } from "dotenv";
import nluRouter from "./routes/nlu";
import packagesRouter from "./routes/packages";

config();

const app = Express();

const PORT = process.env.PORT || 5001;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/nlu", nluRouter);
app.use("/package-hook", packagesRouter);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
