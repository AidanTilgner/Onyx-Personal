import { Router } from "express";
import mappings from "../actions";
import { getActionMetadata } from "../actions/utils";

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
    const [act, subact = "default"] = action.split(".");
    const actionResponse = await mappings[act][subact](req);
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
    } = req as {
      params: {
        action: string;
      };
    };
    if (!mappings.hasOwnProperty(action)) {
      return res.send({
        error: `Action "${action}" not found`,
      });
    }
    const [act, subact = "default"] = action.split(".");
    const actionResponse = await mappings[act][subact](req);
    return res.send({
      message: "Action executed successfully",
      response: actionResponse,
    });
  } catch (err) {
    console.log("Error: ", err);
  }
});

router.get("/", (req, res) => {
  const mappingsCopy: { [key: string]: string[] } = {};
  Object.keys(mappings).forEach((key) => {
    mappingsCopy[key] = Object.keys(mappings[key]);
  });
  res.send({
    message: "Successfully got actions",
    actions: mappingsCopy,
  });
});

router.get("/:action", (req, res) => {
  const {
    params: { action },
  } = req;
  const [act, subact = "default"] = action.split(".");
  if (!mappings[act]?.[subact]) {
    return res.send({
      error: `Action "${action}" not found`,
    });
  }
  return res.send({
    message: "Action exists",
    response: mappings[act][subact],
  });
});

router.get("/metadata/:action", (req, res) => {
  const {
    params: { action },
  } = req;
  const [act, subact = "default"] = action.split(".");
  const metadata = getActionMetadata(action);
  if (!metadata) {
    return res.send({
      message: "No metadata found for that action",
      response: {},
    });
  }
  return res.send({
    message: "Action found and metadata returned",
    response: metadata,
  });
});

export default router;
