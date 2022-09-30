import db, { query } from "utils/surrealdb";
import { generateRandomPassword, hashPassword } from "utils/crypto";

export const addUser = async (username: string) => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const result = await db.query(
      "CREATE user SET username = $username, password = $password",
      {
        username: username,
        password: await hashPassword(generateRandomPassword()),
      }
    );
    if (!result) {
      throw new Error("No result returned");
    }

    return {
      ...result,
      message: "User added successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error adding the user",
    };
  }
};

export const getUser = async (username: string) => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const result = await db.query(
      "SELECT * FROM user WHERE username = $username",
      {
        username: username,
      }
    );
    return {
      ...result,
      message: "User fetched successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error fetching the user",
    };
  }
};
