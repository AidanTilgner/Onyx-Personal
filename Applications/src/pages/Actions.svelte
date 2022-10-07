<script>
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import ActionCard from "../lib/components/Cards/ActionCard.svelte";
  import Subtitle from "../lib/components/Header/Subtitle.svelte";
  import Header from "../lib/components/Header/Default.svelte";
  import SearchBar from "../lib/components/SearchBar/SearchBar.svelte";

  let actions = [];
  onMount(async () => {
    const access_token = localStorage.getItem("access_token");
    const res = await fetch(`/api/proxy/actions`, {
      headers: {
        "x-access-token": access_token,
      },
    }).then((res) => res.json());
    actions = res.actions;
  });

  const ignoreActions = new Set(["exception", "parse_and_use_nlu"]);

  $: actionNames = Object.keys(actions).filter((name) => {
    return !ignoreActions.has(name);
  });

  const formatName = (name) => {
    // uppercase each word
    // remove underscores
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
</script>

<main>
  <Header />
  <SearchBar />
  <hr />
  <Subtitle title="Actions" />
  <div class="actions-list">
    {#if actionNames?.length}
      {#each actionNames as actionName}
        <div class="action-group">
          <h3>{formatName(actionName)}</h3>
          {#each actions[actionName] as action}
            <ActionCard
              action={`${actionName}.${action}`}
              custom_style="margin-bottom: 14px;"
            />
          {/each}
        </div>
      {/each}
    {:else}
      <div class="empty">No actions</div>
    {/if}
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
  }

  .actions-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 24px;

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .action-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @include desktop {
      text-align: initial;
      align-items: flex-start;
    }

    h3 {
      margin-bottom: 24px;
      font-size: 20px;
      font-weight: 500;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 10px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
