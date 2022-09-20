<script>
  import Header from "../lib/components/Header/Default.svelte";
  import SearchBar from "../lib/components/SearchBar/SearchBar.svelte";
  import { messages } from "../lib/stores/socket";
  import { currentPath } from "../lib/stores/env";
  import { navigate } from "svelte-routing";
  import RecentActions from "../lib/sections/RecentActions.svelte";

  if ($currentPath === "/") {
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
  <hr />
  <div class="action-cards">
    <RecentActions />
  </div>
</main>

<style lang="scss">
  @use "../lib/styles/partials/mixins" as *;

  main {
    @include default-padding;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @include desktop {
      text-align: initial;
      align-items: flex-start;
    }

    .action-cards {
      // margin-top: 36px;
      width: 100%;
    }
  }
</style>
