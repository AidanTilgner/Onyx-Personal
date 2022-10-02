<script lang="ts">
  export let url: string;
  import { onMount, onDestroy } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import { currentPath } from "@lib/stores/env";
  import { globalHistory } from "svelte-routing/src/history";
  import { initSocket } from "@src/bootstrap/socket.io";
  import { messages } from "@lib/stores/socket";
  import "carbon-components-svelte/css/all.css";
  import { checkAuth } from "@lib/helpers/backend";
  import Login from "./pages/Login/Main.svelte";
  import AlertProvider from "./lib/components/Alerts/AlertProvider.svelte";
  import { dispatchAlert } from "@lib/stores/alerts";

  initSocket();

  let unsubscribe: () => void;
  onMount(() => {
    unsubscribe = globalHistory.listen(({ location, action }) => {
      $currentPath = location.pathname;
    });

    navigate($currentPath);

    checkAuth().then(({ result: { validated }, error }) => {
      if (error) {
        console.log("Dispatching error");
        dispatchAlert({
          kind: "error",
          title: "Error",
          subtitle: error,
          timeout: 5000,
          visible: true,
          caption: "Please try again.",
        });
        navigate("/login");
      }
      if (!validated) {
        dispatchAlert({
          kind: "warning",
          title: "Unauthorized",
          subtitle: "You are not logged in. Please log in to continue.",
          timeout: 5000,
          visible: true,
          caption: new Date().toLocaleString(),
        });
        navigate("/login");
      }
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<main>
  <AlertProvider />
  <Router {url}>
    <Route path="/login" component={Login} />
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
