import axios from "axios";
import { currentAlert } from "../../stores/alerts";
import { navigate } from "svelte-routing";

export const checkAuth = async () => {
  if (
    !localStorage.getItem("access_token") &&
    !localStorage.getItem("refresh_token")
  ) {
    currentAlert.set({
      title: "Error",
      message: "You are not logged in",
      type: "danger",
      show: true,
    });
    return false;
  }

  const response = await axios
    .post("/api/auth/check", {
      token: localStorage.getItem("access_token"),
    })
    .then(async (res) => {
      if (res.data.authorized) {
        currentAlert.set({
          message: "You have been logged in successfully",
          type: "success",
          show: true,
          timeout: 2000,
        });
        return true;
      }
      // try refreshing token
      const refreshed = await refreshUser();
      if (refreshed) {
        return true;
      }
      currentAlert.set({
        title: "Error",
        message: "You are not logged in",
        type: "danger",
        show: true,
      });
      return false;
    })
    .catch(async (err) => {
      console.error(err);
      // try refreshing token
      const refreshed = await refreshUser();
      if (refreshed) {
        return true;
      }
      currentAlert.set({
        title: "Error",
        message: "Something went wrong with auth",
        type: "danger",
        show: true,
      });
      return false;
    });

  return response;
};

export const loginUser = async (username, password) => {
  try {
    if (!username || !password) {
      currentAlert.set({
        title: "Error",
        message: "Please enter a username and password",
        type: "danger",
        show: true,
      });
      return false;
    }
    const res = await axios
      .post("/api/auth/login", {
        username,
        password,
      })
      .catch((err) => {
        return {
          data: {
            message: err.response.data.error,
            error: true,
          },
        };
      });
    const {
      data: { error, message },
    } = res;
    if (error) {
      currentAlert.set({
        title: "Error",
        message: message,
        type: "danger",
        show: true,
      });
      return false;
    }
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    localStorage.setItem("username", username);
    currentAlert.set({
      message: "You have been logged in successfully",
      type: "success",
      show: true,
      timeout: 2000,
    });
    return true;
  } catch (err) {
    console.error(err);
    currentAlert.set({
      title: "Error",
      message: "There was an error logging you in",
      type: "danger",
      show: true,
    });
    return false;
  }
};

export const refreshUser = async () => {
  try {
    const res = await axios
      .post("/api/auth/refresh", {
        refresh_token: localStorage.getItem("refresh_token"),
        username: localStorage.getItem("username"),
      })
      .catch((err) => {
        return {
          data: {
            message: err,
            error: true,
          },
        };
      });
    console.log("Refreshed", res);
    const {
      data: { error, message },
    } = res;
    if (error) {
      currentAlert.set({
        title: "Error",
        message: message,
        type: "danger",
        show: true,
      });
      return false;
    }
    localStorage.setItem("access_token", res.data.access_token);
    currentAlert.set({
      message: "You have been logged in successfully",
      type: "success",
      show: true,
      timeout: 2000,
    });
    return true;
  } catch (err) {
    console.error(err);
    currentAlert.set({
      title: "Error",
      message: "There was an error logging you in",
      type: "danger",
      show: true,
    });
    return false;
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios
      .post("/api/auth/logout", {
        username: localStorage.getItem("username"),
      })
      .catch((err) => {
        return {
          data: {
            message: err,
            error: true,
          },
        };
      });
    const {
      data: { error, message },
    } = res;
    if (error) {
      currentAlert.set({
        title: "Error",
        message: message,
        type: "danger",
        show: true,
      });
      return false;
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    currentAlert.set({
      message: "You have been logged out successfully",
      type: "success",
      show: true,
      timeout: 2000,
    });
    navigate("/login");
    return true;
  } catch (err) {
    console.error(err);
    currentAlert.set({
      title: "Error",
      message: "There was an error logging you out",
      type: "danger",
      show: true,
    });
    return false;
  }
};
