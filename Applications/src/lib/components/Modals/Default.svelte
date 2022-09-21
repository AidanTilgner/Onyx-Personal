<!-- a generic modal component -->
<script>
  import Buttons from "../Buttons/Buttons.svelte";

  export let title,
    subtitle,
    buttons = [];
</script>

<div class="container">
  <div class="modal">
    <div class="modal__header">
      <h2 class="modal__title">{title}</h2>
      {#if subtitle}
        <h4 class="modal__subtitle">{subtitle}</h4>
      {/if}
    </div>
    <div class="modal__body">
      <slot />
    </div>
    <div class="modal__footer">
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
</div>

<style lang="scss">
  @use "../../styles/partials/variables" as *;
  @use "../../styles/partials/mixins" as *;

  .container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    width: 90%;
    max-width: 500px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
      margin-bottom: 36px;
      padding: 20px;
      border-bottom: 1px solid #eaeaea;
      box-sizing: border-box;

      & > * {
        margin: 14px 0;
      }

      h2 {
        font-size: 32px;
        font-family: $primary-font;
        font-weight: 400;
        margin: 0;
        color: $dark-blue;
        text-align: left;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      h4 {
        font-size: 18px;
        font-family: $primary-font;
        font-weight: 400;
        margin: 0;
        color: $dark-blue;
        text-align: left;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-bottom: 36px;
      padding: 20px;
      box-sizing: border-box;
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      border-top: 1px solid #eaeaea;

      &__button {
        margin-left: 14px;
      }
    }
  }
</style>
