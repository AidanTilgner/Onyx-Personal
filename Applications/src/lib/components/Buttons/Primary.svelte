<script>
  export let text, icon, onClick, title;
</script>

<button class="button" on:click={onClick} {title}>
  {#if icon}
    {#if typeof icon === "string"}
      <i class="material-icons">{icon}</i>
    {/if}
  {/if}
  {text}
</button>

<style lang="scss">
  @use "../../styles/partials/variables" as *;

  .button {
    padding: 8px 14px;
    border-radius: 4px;
    border: none;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-family: $primary-font;
    font-size: 14px;
    color: white;
    font-weight: 500;
    background-color: $cool-blue;
    cursor: pointer;

    &:hover {
      background-color: rgba($color: $cool-blue, $alpha: 0.8);
    }

    &:active {
      transform: translateY(2px);
    }
  }
</style>
