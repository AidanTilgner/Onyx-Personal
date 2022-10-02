<script lang="ts">
  import { TextInput, Button } from "carbon-components-svelte";
  import { signinUser } from "@lib/helpers/backend";
  import { dispatchAlert } from "@lib/stores/alerts";
  import { navigate } from "svelte-routing";

  const formstate: {
    [key: string]: string;
  } = {
    username: "",
    password: "",
  };

  const handleSubmit = async () => {
    console.log("Submitting form", formstate);
    const { username, password } = formstate;
    const response = await signinUser(username, password);
    console.log("res: ", response);
    const {
      result: { access_token, refresh_token, message, error },
      error: main_error,
    } = response;
    if (main_error) {
      dispatchAlert({
        kind: "error",
        title: "Error",
        subtitle: main_error,
        timeout: 5000,
        visible: true,
        caption: "Please try again.",
      });
    }
    if (error) {
      dispatchAlert({
        kind: "error",
        title: "Error",
        subtitle: error,
        timeout: 5000,
        visible: true,
        caption: "Please try again.",
      });
    }
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }
    if (message) {
      dispatchAlert({
        kind: "success",
        title: "Success",
        subtitle: message,
        timeout: 5000,
        visible: true,
        caption: new Date().toLocaleString(),
      });
    }
    navigate("/");
  };
</script>

<main class="login-container">
  <div class="login">
    <div class="header">
      <h1>Log in</h1>
    </div>
    <div class="body">
      <TextInput
        id="username"
        labelText="Username"
        placeholder="Username"
        type="text"
        value={formstate.username}
        on:change={(e) => (formstate.username = e.detail.toString())}
      />
      <br />
      <TextInput
        id="password"
        labelText="Password"
        placeholder="Password"
        type="password"
        value={formstate.password}
        on:input={(e) => (formstate.password = e.detail.toString())}
      />
    </div>
    <div class="footer">
      <Button kind="primary" on:click={handleSubmit}>Log in</Button>
    </div>
  </div>
</main>

<style lang="scss">
  @use "../../lib/styles/partials/variables" as *;
  @use "../../lib/styles/partials/mixins" as *;

  .login-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login {
    width: 90%;
    box-shadow: 0.2px 0.2px 56px 0px rgba(0, 0, 0, 0.25);
    font-family: $font-primary;

    @include tablet {
      width: 50%;
    }

    .header {
      padding: 14px 24px;
      border-bottom: 1px solid #e0e0e0;

      h1 {
        font-size: 28px;
        font-weight: 500;
      }
    }

    .body {
      padding: 24px;
    }

    .footer {
      padding: 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
