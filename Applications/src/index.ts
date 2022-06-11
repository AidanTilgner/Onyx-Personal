import express from "express";

const app: express.Application = express();

const port: number = 3000;

app.get("/", (_req, _res) => {
  _res.send("Hello World Again Making a change!");
});

app.listen(port, () => {
  console.log("Onyx Application Server Running on Port: ", port);
});
