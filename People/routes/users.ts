import { Router } from "express";
import { addUser, deleteUser, getUser } from "database/queries/users";
import { generateRefreshToken, generateToken } from "utils/jwt";
import { comparePassword } from "utils/crypto";
import { addRefreshToken } from "database/queries/tokens";
import { refreshUser, signInUser } from "controllers/users";

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
    const toSend = await signInUser(username, password);
    res.send(toSend);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error signing in the user",
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { username, refresh_token } = req.body;
    const toSend = await refreshUser(username, refresh_token);
    res.send(toSend);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error refreshing the token",
    });
  }
});

export default router;
