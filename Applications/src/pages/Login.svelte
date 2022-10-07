<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { loginUser, checkAuth } from "../lib/helpers/functions/auth";

  const formState = {
    username: "",
    password: "",
  };

  onMount(async () => {
    const auth = await checkAuth();
    if (auth) {
      navigate("/home");
    }
  });

  const handleSubmit = async () => {
    const { username, password } = formState;
    const loggedIn = await loginUser(username, password);
    if (loggedIn) {
      navigate("/home");
    }
  };
</script>

<main>
  <div class="login-modal">
    <div class="login-modal-content">
      <div class="login-modal-header">
        <h2>Login to Onyx</h2>
      </div>
      <div class="login-modal-body">
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              bind:value={formState.username}
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              bind:value={formState.password}
            />
          </div>
          <div class="form-group">
            <button type="submit" class="submit-button">Login</button>
          </div>
        </form>
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

  .form-group {
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
