import express from "express";
import { config } from "dotenv";
import queryRouter from "./routes/queries";
import packagesRouter from "./routes/packages";
config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/query", queryRouter);
app.use("/package-hook", packagesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
