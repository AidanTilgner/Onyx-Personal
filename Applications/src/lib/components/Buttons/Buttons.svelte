<script>
  export let type = "primary",
    button;
  import Outline from "./Outline.svelte";
  import Arrow from "./Arrow.svelte";
  import Primary from "./Primary.svelte";
</script>

{#if type === "primary"}
  <Primary {...button} />
{/if}

{#if type === "outline"}
  <Outline {...button} />
{/if}

{#if type === "arrow"}
  <Arrow {...button} />
{/if}
