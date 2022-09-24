<script lang="ts">
  export let url: string;
  import { onMount, onDestroy } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import { currentPath } from "@lib/stores/env";
  import { globalHistory } from "svelte-routing/src/history";
  import { initSocket } from "@src/bootstrap/socket.io";
  import { messages } from "@lib/stores/socket";

  initSocket();

  let unsubscribe: () => void;
  onMount(() => {
    unsubscribe = globalHistory.listen(({ location, action }) => {
      $currentPath = location.pathname;
    });

    navigate($currentPath);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<main>
  <Router {url}>
    <Route path="*">
      <div class="content-container">
        <p>Hello world</p>
        {#each $messages as message}
          <p>{message}</p>
        {/each}
      </div>
    </Route>
  </Router>
</main>

<style lang="scss">
  @use "./lib/styles/partials/mixins" as *;

  .content-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
  }
</style>
