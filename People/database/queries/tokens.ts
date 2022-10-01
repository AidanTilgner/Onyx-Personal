import db from "utils/surrealdb";

export const addRefreshToken = async (key: string, token: string) => {
  try {
    const [result] = await db.query(
      "CREATE reset_token SET value = $token, key = $key",
      {
        key: key,
        token: token,
      }
    );
    console.log("Added token", result);
    if (!result.result) {
      return {
        error: "There was an error adding the reset token",
        message: "There was an error adding the reset token",
      };
    }
    return {
      result: result.result,
      message: "Reset token added successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error adding the reset token",
    };
  }
};

export const getRefreshToken = async (key: string) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM reset_token WHERE key = $key",
      {
        key: key,
      }
    );
    console.log("Original result", result);
    const token = result.result[0] as { value: string };

    if (!token) {
      return {
        error: "There was an error fetching the reset token",
        message: "There was an error fetching the reset token",
      };
    }
    return {
      result: token,
      message: "Reset token fetched successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error fetching the reset token",
    };
  }
};
