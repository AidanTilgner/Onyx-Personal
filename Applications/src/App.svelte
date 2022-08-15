<script>
  import { initSocket } from "./bootstrap/socket.io";
  import {
    getExternalWidgets,
    setExternalWidgets,
  } from "./bootstrap/external_widgets";
  import { Router, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import SideBar from "./lib/components/SideBar/SideBar.svelte";
  export let url;

  const initialized = initSocket();

  $: if (initialized) {
    const widgets = getExternalWidgets();
    setExternalWidgets(widgets);
  }
</script>

<main>
  <SideBar />
  <Router {url}>
    <div class="content-container">
      <Route path="*" component={Home} />
      <Route path="/" component={Home} />
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
