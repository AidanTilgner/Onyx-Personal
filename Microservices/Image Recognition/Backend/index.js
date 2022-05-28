import * as tf from "@tensorflow/tfjs-node";
import coco_ssd from "@tensorflow-models/coco-ssd";
import express from "express";
import { config } from "dotenv";
// busboy import
import busboy from "busboy";
config();

// * INIT MODEL
let model = undefined;
(async () => {
  model = await coco_ssd.load({
    base: "mobilenet_v1",
  });
})();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

const wrapAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.post("/predict", (req, res) => {
  if (!model) {
    res.status(500).send("Model is not loaded yet!");
    return;
  }

  console.log("Hit /predict endpoint");
  const bb = busboy({ headers: req.headers });
  console.log("busboy created");
  bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("Type: ", mimetype);
    const buffer = [];
    file.on("data", (data) => {
      buffer.push(data);
    });
    file.on("end", async () => {
      const image = tf.node.decodeImage(Buffer.concat(buffer));
      const predictions = await model.detect(image, 3, 0.25);
      console.log("Predictions: ", predictions);
      res.json(predictions);
    });
  });
  req.pipe(bb);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
