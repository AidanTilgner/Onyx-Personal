<script lang="ts">
  import { onMount } from "svelte";
  import type { AllowedRoles, User } from "../../declarations/main";
  interface UserProps {
    username: string;
  }

  export let username: UserProps["username"];

  let user: User | null = null;

  onMount(async () => {
    const response = await fetch(`/api/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((res) => res.json());
    console.log(response);
    user = response.result;
  });

  const roleToColor: {
    [key in AllowedRoles]: string;
  } = {
    hyperuser: "#2256f2",
    superuser: "#8DF20A",
    user: "#F2A10A",
  };

  $: if (user) {
    // set a new "role-color" css variable which has a value of roleToColor[user.role]
    document.documentElement.style.setProperty(
      "--role-color",
      roleToColor[user.role]
    );
  }
</script>

<main>
  <h1 class="username">{user?.username}</h1>
  <div class="role"><span>{user?.role}</span></div>
</main>

<style lang="scss">
  $role-color: var(--role-color);

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

    .username {
      font-size: 36px;
      margin: 24px 0;
    }

    .role {
      font-size: 13px;
      color: #fff;
      font-family: "QuickSand", sans-serif;
      border-radius: 99px;
      padding: 10px 18px;
      font-weight: 500;
      background-color: $role-color;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
