import { Router } from "express";
import { deleteUser, getUser } from "database/queries/users";
import { addUser, getMe, getUsers } from "controllers/users";
import { refreshUser, signInUser } from "controllers/users";
import { authenticateSuperUser, authenticateToken } from "middleware/auth";

const router = Router();

router.post("/add", authenticateSuperUser, async (req, res) => {
  try {
    const { username, role } = req.body;
    const result = await addUser(username, role);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error adding the user",
    });
  }
});

router.get("/", authenticateSuperUser, async (req, res) => {
  try {
    const result = await getUsers();
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error fetching the user",
    });
  }
});

router.get("/:username", authenticateSuperUser, async (req, res) => {
  try {
    const username = req.params.username;
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

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const decoded = req.body.decoded_token;
    if (typeof decoded === "string") {
      return res.send({
        error: decoded,
        message: "There was an error fetching the user",
      });
    }
    const result = await getMe(decoded);
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
