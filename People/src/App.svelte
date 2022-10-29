<script lang="ts">
  export let url: string;
  import { onMount, onDestroy } from "svelte";
  import { Router, Route, navigate, Link } from "svelte-routing";
  import { currentPath } from "@lib/stores/env";
  import { globalHistory } from "svelte-routing/src/history";
  import { initSocket } from "@src/bootstrap/socket.io";
  import { messages } from "@lib/stores/socket";
  import "carbon-components-svelte/css/all.css";
  import { checkAuth } from "@lib/helpers/backend";
  import { dispatchAlert } from "@lib/stores/alerts";
  import Login from "./pages/Login/Main.svelte";
  import Household from "./pages/Household/Household.svelte";
  import User from "./pages/Household/User.svelte";
  import AlertProvider from "./lib/components/Alerts/AlertProvider.svelte";
  import Navbar from "./lib/components/Navbar/Navbar.svelte";
  import NewUser from "./pages/Household/New.svelte";

  initSocket();

  let unsubscribe: () => void;
  onMount(() => {
    unsubscribe = globalHistory.listen(({ location, action }) => {
      $currentPath = location.pathname;
    });

    navigate($currentPath);

    checkAuth().then((res) => {
      const { error, validated, message } = res;
      if (error) {
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
    <div>
      <Navbar />
      <Route path="/household" component={Household} />
      <Route path="/household/new" component={NewUser} />
      <Route path="/household/:username" let:params>
        <User username={params.username} />
      </Route>
      <Route path="*">
        <div class="content-container">
          <Link to="/household">View Users</Link>
          <hr />
          <br />
          <h2>Logs:</h2>
          <br />
          <div class="logs">
            {#each $messages as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>
      </Route>
    </div>
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

  .logs {
    margin-top: 36px;
    width: 100%;
    height: 25%;
    overflow: scroll;
    background-color: #f4f4f4;
  }
</style>
