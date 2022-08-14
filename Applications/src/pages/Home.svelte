<script>
  import Header from "../lib/components/Header/Default.svelte";
  import { messages } from "../lib/stores/socket";
  import { getContext } from "svelte";
  import { ROUTER } from "svelte-routing/src/contexts";
  import { navigate } from "svelte-routing";
  console.log("Home");

  const { activeRoute } = getContext(ROUTER);
  if (activeRoute.uri === "/") {
    navigate("/home");
  }
  let messagesArray = [];
  messages.subscribe((data) => {
    messagesArray = [...data];
  });
</script>

<main>
  <Header />
  <p>Home page</p>
  <div id="container-speech_input" class="external-widget" />
  <div>
    {#each messagesArray as message}
      <p>{message}</p>
    {/each}
  </div>
</main>

<style lang="sass">

</style>
