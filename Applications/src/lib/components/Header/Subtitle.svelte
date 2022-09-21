<script>
  export let title,
    subtitle,
    buttons = [];
  import Buttons from "../Buttons/Buttons.svelte";
</script>

<div class="header">
  <div>
    <h2 class="header_title">
      {title}
    </h2>
    {#if subtitle}
      <h4>{subtitle}</h4>
    {/if}
  </div>
  <div>
    {#each buttons as button}
      <Buttons
        type={button.type}
        button={{
          text: button.text,
          onClick: button.onClick,
        }}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  @use "../../styles/partials/variables" as *;
  @use "../../styles/partials/mixins" as *;
  .header {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 36px;

    & > * {
      margin: 14px 0;
    }

    @include tablet {
      flex-direction: row;
      align-items: center;
    }
  }

  h2 {
    font-size: 36px;
    font-family: $primary-font;
    font-weight: 400;
    margin: 0;
    color: $dark-blue;
    text-align: left;

    @include desktop {
      text-align: left;
    }
  }

  h4 {
    font-family: $secondary-font;
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    margin-top: 14px;
    margin-bottom: 36px;
    font-weight: 300;
    color: $cool-blue;
    text-align: left;

    @include desktop {
      text-align: left;
    }
  }
</style>
