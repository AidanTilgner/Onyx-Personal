<script>
</script>

<div class="background">
  <div id="container-speech_input" class="external-widget voice-input" />
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;

  .background {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    box-shadow: 0 -4px 24px 0 rgba($color: #000000, $alpha: 0.05);
    padding: 24px 0;

    @include desktop {
      background-color: #fdfdfd;
      box-shadow: none;
      padding: 0;
      top: 36px;
      right: 56px;
      left: initial;
      bottom: initial;
    }
  }

  .voice-input {
  }
</style>
