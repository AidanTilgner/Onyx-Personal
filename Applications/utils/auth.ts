import { peopleServer } from "./axios";

export const checkAuth = async (token: string) => {
  try {
    if (!token) {
      return false;
    }

    const response = await peopleServer
      .post("/api/auth/check", {
        token,
      })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response.status !== 200 || err.response.status !== 401) {
          console.error(err);
        }
        return {
          error: err,
          message: "There was an error authenticating",
          validated: false,
        };
      });

    const { validated, message, error } = response as {
      validated: boolean;
      message: string;
      error: any;
    };

    if (!validated) {
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
