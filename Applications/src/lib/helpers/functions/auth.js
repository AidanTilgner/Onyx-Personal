import axios from "axios";
import { currentAlert } from "../../stores/alerts";

export const checkAuth = async () => {
  if (!localStorage.getItem("app_key")) {
    currentAlert.set({
      title: "Error",
      message: "You are not logged in",
      type: "danger",
      show: true,
    });
    return false;
  }

  axios
    .post("/api/auth/check", {
      token: localStorage.getItem("app_key"),
    })
    .then((res) => {
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

export const getLoginURL = async () => {
  try {
    const res = await axios.get("/api/auth/login-url");
    return res.data.url;
  } catch (err) {
    console.error(err);
    currentAlert.set({
      title: "Error",
      message:
        "There was an error fetching the login url, please go to login page manually",
      type: "danger",
      show: true,
    });
    return false;
  }
};
