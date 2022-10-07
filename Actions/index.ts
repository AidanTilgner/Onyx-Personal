import express from "express";
import { config } from "dotenv";
import packagesRouter from "./routes/packages";
import actionsRouter from "./routes/actions";
import { generateMetaData } from "./config/metadata";
import { authToken } from "./middleware/auth";

config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/package-hook", packagesRouter);
app.use("/actions", authToken, actionsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

generateMetaData();
