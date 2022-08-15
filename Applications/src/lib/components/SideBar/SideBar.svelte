<script>
</script>

<div class="sidebar" />

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  .sidebar {
    display: none;
    @include desktop {
      display: block;
      width: 224px;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 4px 0px 24px rgba(0, 0, 0, 0.05);
    }
  }
</style>
