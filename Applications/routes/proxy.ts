import { Router } from "express";
import axios from "axios";
const router = Router();

router.get("/", async (req, res) => {});

router.post("/", async (req, res) => {
  try {
    const { url, body } = req.body;
    const response = await axios.post(url, body);
    res.send({
      message: `Successfully proxied request to ${url}`,
      response: response.data,
    });
  } catch (err) {
    console.log(`Error proxying url: ${req.query.url}`, err);
    res.send({
      error: `Error proxying url: ${req.query.url}` + err,
    });
  }
});

export default router;
