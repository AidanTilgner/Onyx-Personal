<script>
  export let width = "100%";
</script>

<div class="card" style="width: {width}">
  <slot />
</div>

<style lang="scss">
  .card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 400px;
  }
</style>
