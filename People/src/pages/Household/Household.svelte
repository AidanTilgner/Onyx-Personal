<script lang="ts">
  import { onMount } from "svelte";
  import { getUsers } from "@lib/helpers/backend";
  import { dispatchAlert } from "@lib/stores/alerts";

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

    dispatchAlert({
      kind: "success",
      title: "Success",
      subtitle: message,
      timeout: 5000,
      visible: true,
      caption: new Date().toLocaleString(),
    });

    users = result;
  });
</script>

<main>
  <h2>Users</h2>
  <div class="users">
    {#each users as user}
      <UserCard username={user.username} role={user.role} />
    {/each}
  </div>
</main>

<style lang="scss">
  @use "../../lib/styles/partials/mixins" as *;
  @use "../../lib/styles/partials/variables" as *;

  main {
    padding: 124px 24px;

    h2 {
      font-size: 48px;
      font-weight: 500;
      margin-bottom: 24px;
      font-family: $font-primary;
    }
  }
</style>
