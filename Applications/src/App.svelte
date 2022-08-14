<script>
  import { initSocket } from "./bootstrap/socket.io";
  import {
    getExternalWidgets,
    setExternalWidgets,
  } from "./bootstrap/external_widgets";
  import { Router, Route, navigate } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import { onMount } from "svelte";
  export let url;

  const initialized = initSocket();

  $: if (initialized) {
    const widgets = getExternalWidgets();
    setExternalWidgets(widgets);
  }
</script>

<main>
  <Router {url}>
    <Route path="*" component={Home} />
    <Route path="/" component={Home} />
  </Router>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
