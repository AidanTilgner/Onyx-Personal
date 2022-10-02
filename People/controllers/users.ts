import { comparePassword } from "@utils/crypto";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "@utils/jwt";
import {
  addRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "database/queries/tokens";
import {
  getUser as getDBUser,
  addUser as addDBUser,
} from "database/queries/users";
import { AllowedRoles } from "interfaces/roles";
import { User } from "interfaces/users";

export const addUser = async (username: string, role: AllowedRoles) => {
  try {
    const { user, error } = await addDBUser(username, role);
    if (error) {
      return {
        error: error,
        message: "There was an error adding the user",
      };
    }
    return {
      result: user,
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
    const { user, error } = await getDBUser(username);
    if (error) {
      return {
        error: error,
        message: "There was an error fetching the user",
      };
    }
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

export const signInUser = async (username: string, password: string) => {
  try {
    console.log("Signing in user", username);
    // Find user
    const { user, error } = await getDBUser(username);

    if (error) {
      return {
        error,
      };
    }

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    // Compare passwords
    const { password: hashedPassword } = user;
    const isPasswordCorrect = await comparePassword(password, hashedPassword);

    if (!isPasswordCorrect) {
      return {
        error: "Invalid password",
        message: "Invalid password",
      };
    }

    const access_token = generateToken(user);
    await deleteRefreshToken(username);
    const refresh_token = generateRefreshToken(
      { access_token },
      { expiresIn: "1y" }
    );
    await addRefreshToken(username, refresh_token);

    return {
      access_token,
      refresh_token,
      message: "User signed in successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error signing in the user",
    };
  }
};

export const refreshUser = async (username: string, refresh_token: string) => {
  try {
    const validated = verifyRefreshToken(refresh_token);

    if (!validated) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        status: 401,
      };
    }

    const response = await getRefreshToken(username);
    const {
      result: { value: token },
      error,
      message,
    } = response;

    if (error) {
      return {
        error,
        message,
      };
    }

    if (!token) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        status: 401,
      };
    }

    const { user, error: user_error } = await getDBUser(username);

    if (user_error) {
      return {
        error: user_error,
        message: "There was an error fetching the user",
      };
    }

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    delete user.password;

    const new_access_token = generateToken(user);

    return {
      message: "User authenticated successfully",
      status: 200,
      access_token: new_access_token,
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error refreshing the token",
    };
  }
};

export const getMe = async (decoded: User) => {
  try {
    const { username } = decoded;
    const { user, error } = await getDBUser(username);

    if (error) {
      return {
        error,
      };
    }

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

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
