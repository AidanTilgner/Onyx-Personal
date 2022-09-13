<script>
  export let type = "primary",
    button;
  import Outline from "./Outline.svelte";
  import Primary from "./Primary.svelte";
</script>

{#if type === "primary"}
  <Primary {...button} />
{/if}

{#if type === "outline"}
  <Outline {...button} />
{/if}
