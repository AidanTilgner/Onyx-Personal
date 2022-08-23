import axios from "axios";
import { currentAlert } from "../../stores/alerts";

export const checkAuth = async () => {
  if (!localStorage.getItem("token")) {
    currentAlert.set({
      title: "Error",
      message: "You are not logged in",
      type: "danger",
      show: true,
    });
    return false;
  }

  axios
    .get("/api/auth/check", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then((res) => {
      if (res.data.status === 200) {
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
      console.log(err);
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
