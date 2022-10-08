<script>
  import { initSocket } from "./bootstrap/socket.io";
  import {
    getExternalWidgets,
    setExternalWidgets,
  } from "./bootstrap/external_widgets";
  import { Router, Route, navigate } from "svelte-routing";
  import { currentPath } from "./lib/stores/env";
  import { onMount, onDestroy } from "svelte";
  import { globalHistory } from "svelte-routing/src/history";
  import { checkAuth } from "./lib/helpers/functions/auth";
  import Home from "./pages/Home.svelte";
  import Apps from "./pages/Applications.svelte";
  import Graphics from "./pages/Graphics.svelte";
  import Family from "./pages/Family.svelte";
  import News from "./pages/News.svelte";
  import Robots from "./pages/Robots.svelte";
  import SideBar from "./lib/components/SideBar/SideBar.svelte";
  import Console from "./lib/components/Console/Console.svelte";
  import VoiceInput from "./lib/components/VoiceInput/VoiceInput.svelte";
  import Alert from "./lib/components/Alert/Alert.svelte";
  import Login from "./pages/Login.svelte";
  import Actions from "./pages/Actions.svelte";
  import Settings from "./pages/Settings.svelte";
  export let url;

  const initialized = initSocket();

  let unsub;
  (async () => {
    const authed = await checkAuth();
    console.log("authed", authed);
    if (!authed) {
      navigate("/login");
    }
  })();

  onMount(() => {
    unsub = globalHistory.listen(({ location, action }) => {
      $currentPath = location.pathname;
    });

    localStorage.setItem(
      "session",
      JSON.stringify({
        session_id: Math.random().toString(36).substring(2, 15),
      })
    );

    navigate($currentPath);
  });

  onDestroy(() => {
    unsub();
  });

  $: if (initialized) {
    const widgets = getExternalWidgets();
    setExternalWidgets(widgets);
  }
</script>

<main>
  <Router {url}>
    <Alert />
    <Route path="/login" component={Login} />
    <Route path="*">
      <div class="content-container">
        <Router {url}>
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/apps" component={Apps} />
          <Route path="/graphics" component={Graphics} />
          <Route path="/family" component={Family} />
          <Route path="/news" component={News} />
          <Route path="/robots" component={Robots} />
          <Route path="/actions" component={Actions} />
          <Route path="/settings" component={Settings} />
          <Route path="*" component={Home} />
        </Router>
        <SideBar />
        <Console />
        <VoiceInput />
      </div>
    </Route>
  </Router>
</main>

<style lang="scss">
  @use "./lib/styles/partials/mixins" as *;

  .content-container {
    margin-bottom: 156px;

    @include desktop {
      margin-left: 216px;
      background-color: #fdfdfd;
    }
  }
</style>
