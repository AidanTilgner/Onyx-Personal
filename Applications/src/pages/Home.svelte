<script>
  import Header from "../lib/components/Header/Default.svelte";
  import SearchBar from "../lib/components/SearchBar/SearchBar.svelte";
  import { messages } from "../lib/stores/socket";
  import { currentPath } from "../lib/stores/env";
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Subtitle from "../lib/components/Header/Subtitle.svelte";
  import ActionCard from "../lib/components/Cards/ActionCard.svelte";

  if (currentPath === "/") {
    navigate("/home");
  }
  let messagesArray = [];
  messages.subscribe((data) => {
    messagesArray = [...data];
  });

  onMount(async () => {
    const actions = await fetch("/api/proxy/actions").then((res) => res.json());
    console.log("actions: ", actions);
  });
</script>

<main>
  <Header />
  <SearchBar />
  <hr />
  <div class="action-cards">
    <Subtitle
      title="Recent Actions"
      buttons={[
        {
          text: "View All",
          onClick: () => navigate("/actions"),
          type: "outline",
        },
      ]}
    />
    <ActionCard width={"33%"} />
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
