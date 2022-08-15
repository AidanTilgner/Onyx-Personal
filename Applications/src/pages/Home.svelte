<script>
  import Header from "../lib/components/Header/Default.svelte";
  import VoiceInput from "../lib/components/VoiceInput/VoiceInput.svelte";
  import { messages } from "../lib/stores/socket";
  import { getContext } from "svelte";
  import { ROUTER } from "svelte-routing/src/contexts";
  import { navigate } from "svelte-routing";
  console.log("Home");

  const { activeRoute } = getContext(ROUTER);
  let uri;
  activeRoute.subscribe((route) => {
    uri = route.uri;
  });
  console.log("activeRoute", uri);
  if (uri === "/") {
    navigate("/home");
  }
  let messagesArray = [];
  messages.subscribe((data) => {
    messagesArray = [...data];
  });
</script>

<main>
  <Header />
  <VoiceInput />
  <p>Home page</p>
  <div>
    {#each messagesArray as message}
      <p>{message}</p>
    {/each}
  </div>
</main>

<style lang="sass">

</style>
