import { Router } from "express";
import { addUser, getUser } from "database/queries/users";

const router = Router();

router.post("/add", async (req, res) => {
  try {
    const { username } = req.body;
    const result = await addUser(username);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error adding the user",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { username } = req.query || req.body;
    const result = await getUser(username);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error fetching the user",
    });
  }
});

export default router;
