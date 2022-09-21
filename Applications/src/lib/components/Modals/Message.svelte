<script>
  import Buttons from "../Buttons/Buttons.svelte";

  export let title = "",
    buttons = [];
</script>

<div class="message">
  {#if title}
    <div class="message__header">
      <h3>{title}</h3>
    </div>
  {/if}
  <div class="message__content">
    <slot />
  </div>
  <div class="message__footer">
    {#each buttons as button}
      <div class="modal__footer__button">
        <Buttons
          type={button.type}
          button={{
            text: button.text,
            onClick: button.onClick,
          }}
        />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;

  .message {
    position: fixed;
    left: 24px;
    right: 24px;
    bottom: 24px;
    height: fit-content;
    max-height: 80vh;
    // glassmorphism
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    z-index: 500;

    @include tablet {
      right: 56px;
      bottom: 20vh;
      width: fit-content;
      max-width: 50vw;
      height: fit-content;
      max-height: 80vh;
    }

    &__header {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      padding: 36px 24px;
      text-align: center;

      h3 {
        font-size: 24px;
        font-weight: 500;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 24px;
    }
  }
</style>
