import * as tf from "@tensorflow/tfjs-node";
import coco_ssd from "@tensorflow-models/coco-ssd";
import express from "express";
import { config } from "dotenv";
config();

const App = express();
const PORT = process.env.PORT || 5000;

console.log(tf.getBackend());
let model;
(async () => {
  model = await coco_ssd.load({
    base: "lite_mobilenet_v2",
  });
})();

// App.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
