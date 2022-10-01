import db from "utils/surrealdb";
import { generateRandomPassword, hashPassword } from "utils/crypto";
import { User } from "interfaces/users";

export const addUser = async (username: string) => {
  try {
    if (!username) {
      return {
        error: "Username is required",
        message: "Username is required",
      };
    }
    if (await checkUserExists(username)) {
      return {
        error: "Username already exists",
        message: "Username already exists",
      };
    }
    const randomPassword = generateRandomPassword();
    const [result] = await db.query(
      "CREATE users SET username = $username, password = $password",
      {
        username: username,
        password: await hashPassword(randomPassword),
      }
    );
    if (!result.result) {
      return {
        error: "There was an error adding the user",
        message: "There was an error adding the user",
      };
    }

    const user = result.result[0] as User;

    return {
      result: user,
      generated_password: randomPassword,
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

export const checkUserExists = async (username: string) => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const [result] = await db.query(
      "SELECT username FROM users WHERE username = $username",
      {
        username: username,
      }
    );

    if (!result.result) {
      return false;
    }

    const users = result.result as Array<User>;

    if (users.length > 0) {
      return true;
    }

    return false;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUser = async (username: string) => {
  try {
    if (!username) {
      return {
        error: "Username is required",
        message: "Username is required",
      };
    }

    const [result] = await db.query(
      "SELECT * FROM users WHERE username = $username",
      {
        username: username,
      }
    );

    if ((result.result as any[])?.length === 0) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    const user = result.result[0] as User;

    return {
      result: user,
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

export const deleteUser = async (username: string) => {
  try {
    if (!username) {
      return {
        error: "Username is required",
        message: "Username is required",
      };
    }

    const [result] = await db.query(
      "DELETE FROM users WHERE username = $username",
      {
        username: username,
      }
    );

    return {
      result: result.result,
      message: "User deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error deleting the user",
    };
  }
};
