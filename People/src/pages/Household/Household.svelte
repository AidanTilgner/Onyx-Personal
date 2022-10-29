<script lang="ts">
  import { onMount } from "svelte";
  import { getUsers } from "@lib/helpers/backend";
  import { dispatchAlert } from "@lib/stores/alerts";
  import { navigate } from "svelte-routing";

  import UserCard from "../../lib/components/Cards/UserCard.svelte";

  let users = [];
  onMount(async () => {
    const { error, result, message } = await getUsers();
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

    // dispatchAlert({
    //   kind: "success",
    //   title: "Success",
    //   subtitle: message,
    //   timeout: 5000,
    //   visible: true,
    //   caption: new Date().toLocaleString(),
    // });

    users = result;
  });
</script>

<main>
  <div class="header">
    <h2>Users</h2>
    <button on:click={() => navigate("/household/new")}> New User </button>
  </div>
  <div class="users">
    {#each users as user}
      <UserCard username={user.username} role={user.role} />
      <br />
    {/each}
  </div>
</main>

<style lang="scss">
  @use "../../lib/styles/partials/mixins" as *;
  @use "../../lib/styles/partials/variables" as *;

  main {
    padding: 124px 24px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        font-size: 36px;
        font-weight: 500;
        margin-bottom: 24px;
        font-family: $font-primary;
      }

      button {
        @include button-primary;
      }
    }
  }
</style>
