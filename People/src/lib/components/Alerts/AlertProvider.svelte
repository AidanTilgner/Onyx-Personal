<script lang="ts">
  import { currentAlert } from "@lib/stores/alerts";
  import { Alert } from "@src/declarations/main";
  import { ToastNotification } from "carbon-components-svelte";

  let alert: Alert | null = null;
  let open: boolean = false;
  let timeoutState = setTimeout(() => {}, 0);
  $: if ($currentAlert) {
    alert = $currentAlert;
    const { visible, timeout } = $currentAlert;
    if (visible) {
      open = true;
    }
    if (timeout) {
      clearTimeout(timeoutState);
      timeoutState = setTimeout(() => {
        open = false;
        alert = null;
      }, timeout);
    }
  }
</script>

{#if alert}
  <div class="container">
    <ToastNotification
      fullWidth
      lowContrast
      bind:open
      {...alert}
      on:close={() => {
        open = false;
      }}
    />
  </div>
{/if}

<style lang="scss">
  .container {
    position: fixed;
    top: 14px;
    left: 24px;
    right: 24px;
    z-index: 1000;
  }
</style>
