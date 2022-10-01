import { comparePassword } from "@utils/crypto";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "@utils/jwt";
import { addRefreshToken, getRefreshToken } from "database/queries/tokens";
import { getUser } from "database/queries/users";

export const signInUser = async (username: string, password: string) => {
  try {
    // Find user
    const { result: user, error, message } = await getUser(username);

    if (error) {
      return {
        error,
        message,
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

    const access_token = generateToken({ username });
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
    console.log("VALIDATED", validated);

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
    console.log("TOKEN", response);

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

    // const {
    //   result: user,
    //   error: user_error,
    //   message: user_message,
    // } = await getUser(username);

    // if (user_error) {
    //   return {
    //     error: user_error,
    //     message: user_message,
    //   };
    // }

    // if (!user) {
    //   return {
    //     error: "User not found",
    //     message: "User not found",
    //   };
    // }
    // ^ For if you want to generate a more complex token

    const new_access_token = generateToken({ username });
    console.log("NEW ACCESS TOKEN", new_access_token);

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
