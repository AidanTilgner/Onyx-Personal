import { Router } from "express";
import { addUser, deleteUser, getUser } from "database/queries/users";
import { generateToken } from "utils/jwt";
import { comparePassword } from "utils/crypto";

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
    const username = req.body.username || req.query.username;
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

router.delete("/", async (req, res) => {
  try {
    const username = req.body.username || req.query.username;
    const result = await deleteUser(username);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error deleting the user",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { result, error, message } = await getUser(username);
    if (error) {
      return res.send({
        error,
        message,
      });
    }
    const { password: hashedPassword } = result;
    const isPasswordCorrect = await comparePassword(password, hashedPassword);
    if (!isPasswordCorrect) {
      return res.send({
        error: "Invalid password",
        message: "Invalid password",
      });
    }
    const token = generateToken({ username });
    res.send({
      token: token,
      message: "User signed in successfully",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error signing in the user",
    });
  }
});

export default router;
