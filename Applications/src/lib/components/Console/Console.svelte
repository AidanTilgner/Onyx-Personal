<script>
  import { console_messages } from "../../stores/socket";
  let open = false;
  let messagesArray = [];
  console_messages.subscribe((data) => {
    messagesArray = [...data];
  });
  $: console.log("messages", messagesArray);
</script>

<div class="console-container">
  {#if open}
    <div class="console">
      <div class="console-messages">
        {#each messagesArray as message}
          <p class="console-message">{message}</p>
        {/each}
      </div>
      <i
        on:click={() => {
          open = false;
        }}
        class="close-button material-symbols-outlined"
        title="Close Console">close</i
      >
    </div>
  {:else}
    <i
      class="material-symbols-outlined open-button"
      title="Open Console"
      on:click={() => {
        open = true;
      }}>terminal</i
    >
  {/if}
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

  .console-container {
    display: none;

    @include desktop {
      display: block;
    }
  }

  .console {
    position: fixed;
    bottom: 0;
    left: 224px;
    right: 0;
    height: 200px;
    box-shadow: 4px -4px 24px 0 rgba(0, 0, 0, 0.1);
    // border: 2px solid rgba($color: $cool-blue, $alpha: 0.25);
    overflow-x: scroll;
    padding: 24px 24px;
    box-sizing: border-box;

    .close-button {
      position: absolute;
      top: 24px;
      right: 24px;
      padding: 8px;
      font-size: 18px;
      border-radius: 50%;
      background-color: white;
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
      border: 1px solid $danger-red;
      color: $danger-red;
      cursor: pointer;

      &:hover {
        background-color: #f9f9f9;
      }
    }
  }

  .console-message {
    font-size: 14px;
    color: $dark-blue;
    font-weight: 500;
    margin: 0;
    margin-bottom: 8px;
    border-left: 1px solid rgba($color: $cool-blue, $alpha: 0.5);
    padding-left: 14px;
    cursor: default;

    &:hover {
      background-color: rgba($color: $cool-blue, $alpha: 0.05);
    }
  }

  .open-button {
    font-size: 26px;
    cursor: pointer;
    padding: 12px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
    color: $dark-blue;
    position: fixed;
    right: 56px;
    bottom: 36px;

    &:hover {
      background-color: #f9f9f9;
    }
  }
</style>
