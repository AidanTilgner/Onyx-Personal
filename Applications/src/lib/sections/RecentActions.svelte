<script>
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import ActionCard from "../components/Cards/ActionCard.svelte";
  import Subtitle from "../components/Header/Subtitle.svelte";

  let actions = {};
  onMount(async () => {
    const res = await fetch("/api/proxy/actions").then((res) => res.json());
    console.log("actions: ", actions);
    actions = res.actions;
  });

  $: actArray = Object.keys(actions);
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
  {#each actArray as actionType}
    {#each actions[actionType] as action}
      <ActionCard action={`${actionType}.${action}`} />
    {/each}
  {/each}
</div>

<style lang="scss">
  .actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 14px;
    margin-top: 24px;
  }
</style>
