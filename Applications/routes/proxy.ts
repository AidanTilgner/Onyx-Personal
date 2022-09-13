import { Router } from "express";
import axios from "axios";
import { actionServer } from "../utils/axios";
import { config } from "dotenv";
import multer from "multer";
import FormData from "form-data";
import { globalLog } from "../utils/logger";

config();
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// This needs to be able to get all of the files in the request and add them to the next form data request
router.post("/package", upload.any(), (req, res) => {
  const { initial } = req.body;
  const pkg = JSON.parse(req.body.pkg);
  const files = req.files as Express.Multer.File[];

  const form = new FormData();
  form.append("pkg", JSON.stringify(mapDestinations(pkg)));
  // append files to form
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as Express.Multer.File;
      form.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }
  }

  axios
    .post(`${destinations[initial]}/package-hook`, form)
    .then((response) => {
      return res.send(response.data);
    })
    .catch((err) => {
      globalLog("Error posting package: ", err);
      return res.status(500).send(err);
    });
});

router.get("/actions", async (req, res) => {
  try {
    const response = await actionServer.get("/actions");
    return res.send(response.data);
  } catch (err) {
    console.log("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

router.get("/recent-actions", async (req, res) => {
  try {
    const response = await actionServer.get("/actions/recent");
    return res.send(response.data);
  } catch (err) {
    console.log("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

export default router;

const destinations: { [key: string]: string | undefined } = {
  ACTIONS: process.env.ACTION_SERVER_HOST,
  SPEECH: process.env.SPEECH_SERVER_HOST,
  APPLICATIONS: process.env.APPLICATIONS_SERVER_HOST,
  INTERPRETATION: process.env.INTERPRETATION_SERVER_HOST,
};

const mapDestinations = (pkg: {
  steps: {
    [key: string | number]: {
      next: string;
    };
  };
}) => {
  const steps = Object.keys(pkg.steps);
  const newSteps: { [key: string | number]: { next: string | undefined } } = {};
  steps.forEach((step) => {
    const next = pkg.steps[step].next;
    const destination = destinations[next];
    newSteps[step] = {
      ...pkg.steps[step],
      next: destination || "",
    };
  });

  return {
    ...pkg,
    steps: newSteps,
  };
};
