import { Router } from "express";
import mappings from "../actions";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      body: { action },
    } = req;
    if (!mappings.hasOwnProperty(action)) {
      return res.send({
        error: `Action "${action}" not found`,
      });
    }
    const actionResponse = await mappings[action](req);
    return res.send({
      message: "Action executed successfully",
      response: actionResponse,
    });
  } catch (err) {
    console.log("Error: ", err);
  }
});

router.post("/:action", async (req, res) => {
  try {
    const {
      params: { action },
    } = req;
    if (!mappings.hasOwnProperty(action)) {
      return res.send({
        error: `Action "${action}" not found`,
      });
    }
    const actionResponse = await mappings[action](req);
    return res.send({
      message: "Action executed successfully",
      response: actionResponse,
    });
  } catch (err) {
    console.log("Error: ", err);
  }
});

export default router;
