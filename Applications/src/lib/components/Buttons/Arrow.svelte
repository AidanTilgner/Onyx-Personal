<script>
  export let onClick,
    custom_style = "",
    title = "";
</script>

<button class="button" style={custom_style} on:click={onClick} {title}>
  <i class="material-icons">arrow_forward</i>
</button>

<style lang="scss">
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    background-color: #2256f2;
    color: white;
    cursor: pointer;
    border: none;
    box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.25);

    i {
      font-size: 16px;
    }

    &:hover {
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.35);
    }
  }
</style>
