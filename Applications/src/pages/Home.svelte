<script>
  import Header from "../lib/components/Header/Default.svelte";
  import VoiceInput from "../lib/components/VoiceInput/VoiceInput.svelte";
  import { messages } from "../lib/stores/socket";
  import { currentPath } from "../lib/stores/env";
  import { navigate } from "svelte-routing";

  if (currentPath === "/") {
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
  <div>
    {#each messagesArray as message}
      <p>{message}</p>
    {/each}
  </div>
</main>

<style lang="sass">

</style>
