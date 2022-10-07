import axios from "axios";
import { currentAlert } from "../../stores/alerts";

export const checkAuth = async () => {
  if (!localStorage.getItem("access_token")) {
    currentAlert.set({
      title: "Error",
      message: "You are not logged in",
      type: "danger",
      show: true,
    });
    return false;
  }
  console.log("Checking auth");
  axios
    .post("/api/auth/check", {
      token: localStorage.getItem("access_token"),
    })
    .then((res) => {
      console.log("Auth check", res);
      if (res.data.authorized) {
        currentAlert.set({
          message: "You have been logged in successfully",
          type: "success",
          show: true,
          timeout: 2000,
        });
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
    .catch((err) => {
      console.error(err);
      currentAlert.set({
        title: "Error",
        message: "Something went wrong with auth",
        type: "danger",
        show: true,
      });
      return false;
    });

  return true;
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
