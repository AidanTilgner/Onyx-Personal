import db from "utils/surrealdb";
import { generateRandomPassword, hashPassword } from "utils/crypto";
import { User } from "interfaces/users";

export const addUser = async (
  username: string,
  role: string
): Promise<{ user?: User; error?: string } | null> => {
  try {
    if (!username) {
      return {
        error: "Username is required",
      };
    }
    if (!role) {
      role = "user";
    }
    if (await checkUserExists(username)) {
      return {
        error: "User already exists",
      };
    }
    const randomPassword = generateRandomPassword();
    const [result] = await db.query(
      "CREATE users SET username = $username, password = $password, role = $role",
      {
        username: username,
        password: await hashPassword(randomPassword),
        role: role,
      }
    );
    if (!result.result) {
      return {
        error: "There was an error adding the user",
      };
    }

    const user = result.result[0] as User;

    return { user };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};

export const checkUserExists = async (username: string): Promise<boolean> => {
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

export const getUser = async (
  username: string
): Promise<{ user?: User; error?: string } | null> => {
  try {
    if (!username) {
      return null;
    }

    const [result] = await db.query(
      "SELECT * FROM users WHERE username = $username",
      {
        username: username,
      }
    );

    if ((result.result as any[])?.length === 0) {
      return null;
    }

    const user = result.result[0] as User;

    return { user };
  } catch (err) {
    console.error(err);
    return {
      error: err,
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

export const updateRole = async (username: string, role: string) => {
  try {
    if (!username) {
      return {
        error: "Username is required",
        message: "Username is required",
      };
    }
    if (!role) {
      return {
        error: "Role is required",
        message: "Role is required",
      };
    }

    const [result] = await db.query(
      "UPDATE users SET role = $role WHERE username = $username",
      {
        username: username,
        role: role,
      }
    );

    return {
      result: result.result,
      message: "Role updated successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error updating the role",
    };
  }
};
