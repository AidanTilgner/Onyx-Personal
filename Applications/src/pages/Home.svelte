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

<style lang="scss">
  @use "../lib/styles/partials/mixins" as *;

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    text-align: center;

    @include desktop {
      text-align: initial;
      align-items: flex-start;
    }
  }
</style>
