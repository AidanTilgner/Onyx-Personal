<script>
  import { console_messages } from "../../stores/socket";
  import { dispatch } from "../../helpers/functions/commands";
  import { onMount } from "svelte";

  let open = false;
  let messagesArray = [];
  console_messages.subscribe((data) => {
    messagesArray = [...data];
  });

  let consoleInput = "";
  let prepend = "->";

  const handleConsoleSubmit = () => {
    const [command, ...args] = consoleInput.split(" ");
    dispatch(command, ...args);
  };

  let ref = null;

  onMount(() => {
    ref = document.getElementById("console-input");
    if (ref) {
      ref.focus();
    }
  });
</script>

<div class="console-container">
  {#if open}
    <div
      class="console"
      on:click={() => {
        ref = document.getElementById("console-input");
        ref.focus();
      }}
    >
      <div class="console-messages">
        {#each messagesArray as message}
          <p class="console-message">{JSON.stringify(message)}</p>
        {/each}
      </div>
      <div class="terminal-input">
        <span class="terminal-input__prepend">{prepend}</span>
        <input
          tabindex="0"
          type="text"
          class="terminal-input__input"
          bind:value={consoleInput}
          on:change={(e) => (consoleInput = e.target.value)}
          on:keypress={(e) => {
            if (e.key === "Enter") {
              handleConsoleSubmit();
              consoleInput = "";
            }
          }}
          id="console-input"
        />
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
      position: fixed;
      bottom: 24px;
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
    color: $cool-blue;
    position: fixed;
    right: 56px;
    bottom: 36px;

    &:hover {
      background-color: #f9f9f9;
    }
  }

  .terminal-input {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 14px;
    height: 32px;
    font-family: $primary-font;

    &__input {
      width: calc(100% - 8px);
      font-family: $primary-font;
      border: none;
      border-bottom: 1px solid #eaeaea;
      padding-inline: 24px;
      height: 100%;
      color: $cool-blue;
      font-weight: 500;

      &:focus {
        outline: none;
      }
    }

    &__prepend {
      position: absolute;
      // left middle
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      color: $cool-blue;
      font-size: 14px;
    }
  }
</style>
