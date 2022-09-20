<script>
  export let width = "100%",
    custom_style = "";

  const isMobile = () => {
    return window.innerWidth <= 768;
  };
</script>

<div
  class="card"
  style={`width: ${isMobile() ? "100%" : width};${custom_style}`}
>
  <slot />
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  .card {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
  }
</style>
