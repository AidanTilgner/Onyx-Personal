import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const { text } = req.body;
  res.send({
    message: "Successfully classified input",
  });
});

export default router;
