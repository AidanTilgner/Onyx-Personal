import { Router } from "express";
import mappings from "../mappings/queries";

const router = Router();

router.get("/from-nlu", async (req, res) => {
  try {
    const { function_name } = req.body;
    if (!mappings[function_name]) {
      return res.send({
        error: "Function not found",
      });
    }
    const result = await mappings[function_name](req.body);
    return res.send(result);
  } catch (err) {
    console.log("Error: ", err);
    res.send({
      "I'm sorry, I'm afraid I can't answer that.": err,
    });
  }
});

export default router;
