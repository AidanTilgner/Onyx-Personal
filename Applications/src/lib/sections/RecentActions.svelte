<script>
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import ActionCard from "../components/Cards/ActionCard.svelte";
  import Subtitle from "../components/Header/Subtitle.svelte";

  let actions = [];
  onMount(async () => {
    const res = await fetch("/api/proxy/recent-actions", {
      headers: {
        "x-access-token": localStorage.getItem("access_token"),
      },
    }).then((res) => res.json());
    actions = res.actions;
  });
</script>

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
<div class="actions">
  {#if actions?.length}
    {#each actions as action}
      <ActionCard {action} />
    {/each}
  {:else}
    <div class="empty">No recent actions</div>
  {/if}
</div>

<style lang="scss">
  @use "../styles/partials/mixins" as *;
  .actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 24px;
    margin-top: 24px;

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
