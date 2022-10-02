import { dispatchAlert } from "@lib/stores/alerts";

export const signinUser = async (
  username: string,
  password: string
): Promise<{
  error?: string;
  result?: {
    access_token: string;
    refresh_token: string;
    message: string;
    error?: string;
  };
}> => {
  try {
    const result = await fetch(`/api/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(async (res) => {
        return {
          result: await res.json(),
        };
      })
      .catch((err) => {
        return {
          error: err,
        };
      });
    console.log("Result", result);
    return result as {
      error?: string;
      result?: {
        access_token: string;
        refresh_token: string;
        message: string;
      };
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};

export const checkAuth = async (): Promise<{
  result?: {
    validated: boolean;
    message: string;
  };
  error?: string;
}> => {
  try {
    const access_token = localStorage.getItem("access_token");
    const result = await fetch(`/api/auth/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: access_token,
      }),
    }).then((res) => res.json());
    return { result };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};
