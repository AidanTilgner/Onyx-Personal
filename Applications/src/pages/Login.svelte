<script>
  import axios from "axios";
  import { currentAlert } from "../lib/stores/alerts";
  import { checkAuth } from "../lib/helpers/functions/auth";
  import { loggedIn } from "../lib/stores/user";
  import { navigate } from "svelte-routing";

  let app_key = "";
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending body", app_key);
    axios
      .post("/api/auth/check", {
        token: app_key,
      })
      .then((res) => {
        if (!res.data.authorized) {
          currentAlert.set({
            show: true,
            message: "Invalid token",
            type: "danger",
          });
          return;
        }
        localStorage.setItem("app_key", app_key);
        window.location.href = "/";
        console.log(res);
      })
      .catch((err) => {
        currentAlert.set({
          type: "danger",
          message: "There was an issue with attempted login",
          show: true,
        });
        console.log(err);
      });
  };
</script>

<main>
  <div class="login-modal">
    <div class="login-modal-content">
      <div class="login-modal-header">
        <h2>Login to Onyx</h2>
      </div>
      <div class="login-modal-body">
        <div class="input-group">
          <label for="app_key">App Key</label>
          <input
            type="text"
            class="form-control"
            id="app_key"
            placeholder="Enter App Key"
            on:change={(e) => {
              app_key = e.target.value;
            }}
          />
        </div>
        <button type="button" class="submit-button" on:click={handleSubmit}
          >Submit</button
        >
      </div>
    </div>
  </div>
</main>

<style lang="scss">
  @use "../lib/styles/partials/mixins" as *;
  @use "../lib/styles/partials/variables" as *;

  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .login-modal {
    width: 40vw;
    box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.15);

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      padding: 24px 14px;
      font-family: "Inter", sans-serif;
      font-weight: 300;

      h2 {
        font-weight: 300;
        margin: 0;
        font-size: 30px;
      }
    }

    &-body {
      padding: 24px 14px 36px 14px;
      font-family: "Inter", sans-serif;
      font-weight: 300;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;

    label {
      font-family: "Inter", sans-serif;
      font-weight: 300;
      font-size: 22px;
      margin-bottom: 14px;
    }

    input {
      width: 100%;
      padding: 14px 24px;
      border: 1px solid #eaeaea;
      font-family: "Quicksand", sans-serif;
      font-size: 14px;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border: 1px solid $cool-blue;
      }
    }
  }

  .submit-button {
    width: 100%;
    border: none;
    background-color: $cool-blue;
    color: white;
    padding: 14px 14px;
    box-shadow: 0.2px 0.2px 15px 0 rgba($color: #000000, $alpha: 0.15);
    cursor: pointer;
    font-size: 14px;
    font-family: "Quicksand", sans-serif;

    &:hover {
      box-shadow: 0.2px 0.2px 15px 0 rgba($color: #000000, $alpha: 0.35);
    }
  }
</style>
