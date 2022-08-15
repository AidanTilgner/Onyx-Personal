<script>
  import { initSocket } from "./bootstrap/socket.io";
  import {
    getExternalWidgets,
    setExternalWidgets,
  } from "./bootstrap/external_widgets";
  import { Router, Route } from "svelte-routing";
  import { currentPath } from "./lib/stores/env";
  import { onMount, onDestroy } from "svelte";
  import { globalHistory } from "svelte-routing/src/history";
  import Home from "./pages/Home.svelte";
  import Apps from "./pages/Apps.svelte";
  import Graphics from "./pages/Graphics.svelte";
  import Family from "./pages/Family.svelte";
  import News from "./pages/News.svelte";
  import Robots from "./pages/Robots.svelte";
  import SideBar from "./lib/components/SideBar/SideBar.svelte";
  export let url;

  const initialized = initSocket();

  let unsub;

  onMount(() => {
    unsub = globalHistory.listen(({ location, action }) => {
      console.log(location, action);
      $currentPath = location.pathname;
    });
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
  <SideBar />
  <Router {url}>
    <div class="content-container">
      <Route path="/" component={Home} />
      <Route path="*" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/apps" component={Apps} />
      <Route path="/graphics" component={Graphics} />
      <Route path="/family" component={Family} />
      <Route path="/news" component={News} />
      <Route path="/robots" component={Robots} />
    </div>
  </Router>
</main>

<style lang="scss">
  @use "./lib/styles/partials/mixins" as *;

  .content-container {
    @include desktop {
      margin-left: 256px;
      background-color: #fdfdfd;
    }
  }
</style>
