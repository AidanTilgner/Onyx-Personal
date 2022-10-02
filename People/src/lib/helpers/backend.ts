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
  validated?: boolean;
  message?: string;
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
    }).then(
      (res) =>
        res.json() as Promise<{
          message: string;
          validated: boolean;
          error?: string;
        }>
    );
    const { error, validated, message } = result;
    if (error || !validated) {
      const { result, error } = await refreshUser();
      if (error) {
        return {
          error,
        };
      }
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
      }
      return {
        validated: result.validated,
        message: result.message,
      };
    }
    return result;
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};

export const refreshUser = async (): Promise<{
  error?: string;
  result?: {
    access_token: string;
    message: string;
    validated: boolean;
    error?: string;
  };
}> => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    const response = await fetch(`/api/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: refresh_token,
      }),
    }).then((res) => {
      return res.json() as Promise<{
        access_token: string;
        message: string;
        validated: boolean;
        error?: string;
      }>;
    });
    if (response.error) {
      return {
        error: response.error,
      };
    }
    const { access_token } = response;
    localStorage.setItem("access_token", access_token);
    return response as {
      error?: string;
      result?: {
        access_token: string;
        message: string;
        validated: boolean;
      };
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};

export const getUsers = async (): Promise<{
  error?: string;
  result?: any[];
  message?: string;
}> => {
  try {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(`/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json());
    const { error, result, message } = response as {
      error?: string;
      message?: string;
      result?: any[];
    };

    if (error) {
      return {
        error,
        message,
      };
    }

    return {
      result,
      message,
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};
