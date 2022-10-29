<script lang="ts">
  import type { AllowedRoles, User } from "../../declarations/main";
  import { onMount } from "svelte";
  import { TextInput, Select } from "carbon-components-svelte";
  import { dispatchAlert } from "@lib/stores/alerts";

  const userForm = {
    username: "",
    role: "",
  };

  let allowedRoles: AllowedRoles[] = [];

  let generatedPassword: string | null = null;

  const submitUser = async () => {
    const response = await fetch("/api/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(userForm),
    }).then((res) => res.json());

    const { error, message, result } = response;

    if (error) {
      dispatchAlert({
        kind: "error",
        title: "Error",
        subtitle: error,
        timeout: 5000,
        visible: true,
        caption: "Please try again.",
      });
      return;
    }

    if (message) {
      dispatchAlert({
        kind: "success",
        title: "Success",
        subtitle: message,
        timeout: 5000,
        visible: true,
        caption: "Please try again.",
      });
    }

    if (result) {
      generatedPassword = result.generated_password;
    }
  };

  onMount(async () => {
    const response = await fetch("/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((res) => res.json());
    console.log("Response", response);
    const {
      result: { allowed_roles },
    } = response;
    allowedRoles = allowed_roles;
  });
</script>

<main>
  <h1>Add a new user</h1>
  <form on:submit|preventDefault={submitUser}>
    <TextInput
      bind:value={userForm.username}
      label="Username"
      placeholder="Username"
      required
    />
    <Select
      bind:value={userForm.role}
      label="Role"
      placeholder="Select a role"
      required
    >
      {#each allowedRoles as role}
        <option value={role}>{role}</option>
      {/each}
    </Select>
    <button type="submit">Submit</button>
  </form>
  {#if generatedPassword}
    <p>Generated password: {generatedPassword}</p>
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;

    h1 {
      margin-bottom: 36px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  }
</style>
