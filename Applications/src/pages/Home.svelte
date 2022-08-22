<script>
  import Header from "../lib/components/Header/Default.svelte";
  import SearchBar from "../lib/components/SearchBar/SearchBar.svelte";
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
  <SearchBar />
</main>

<style lang="scss">
  @use "../lib/styles/partials/mixins" as *;

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @include desktop {
      text-align: initial;
      align-items: flex-start;
    }
  }
</style>
