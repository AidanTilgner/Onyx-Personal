<script>
  import { voice_response } from "../../stores/socket";

  const formatVoiceResponse = (data) => {
    if (!data) {
      return "";
    }
    const { custom_message } = JSON.parse(data);
    return custom_message;
  };

  const formattedInitialInput = (data) => {
    if (!data) {
      return "";
    }
    const { initial_input } = JSON.parse(data);
    return initial_input;
  };

  let openResponse = false;

  voice_response.subscribe((res) => {
    if (res) {
      openResponse = true;
    }
  });
</script>

<div class="background">
  <div id="container-speech_input" class="external-widget voice-input" />
</div>
{#if openResponse}
  <div class="voice-response-container">
    <div class="voice-response">
      <p class="initial-input">
        "
        {formattedInitialInput($voice_response)}
        "
      </p>
      <p>{formatVoiceResponse($voice_response)}</p>
      <i
        class="material-icons close-button"
        title="Close voice response"
        on:click={() => {
          openResponse = false;
          voice_response.set(null);
        }}>close</i
      >
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

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
    z-index: 10;

    @include desktop {
      background-color: #fdfdfd;
      box-shadow: none;
      padding: 0;
      top: 36px;
      right: 56px;
      left: initial;
      bottom: initial;
      border-radius: 3px;
    }
  }

  .voice-response-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 36px 24px 100px 24px;

    @include desktop {
      top: initial;
      right: initial;
      left: initial;
      bottom: initial;
      padding: 0;
      border-radius: 0;
    }
  }

  .voice-response {
    background-color: white;
    border-radius: 3px;
    margin: 36px 24px 120px 24px;
    width: 100%;
    padding: 24px 14px;
    font-size: 18px;
    text-align: left;
    font-weight: 400;
    box-shadow: inset 0.2px 0.2px 4px rgba(0, 0, 0, 0.15);
    border: 1px solid #eaeaea;
    z-index: 20;
    position: relative;

    @include desktop {
      position: fixed;
      width: 200px;
      margin: 0;
      right: 56px;
      top: 120px;
    }

    .close-button {
      position: fixed;
      bottom: 136px;
      right: 14px;
      padding: 8px;
      background-color: white;
      border-radius: 50%;
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
      color: $danger-red;
      border: 1px solid $danger-red;
      font-size: 18px;
      cursor: pointer;

      @include desktop {
        position: absolute;
        bottom: initial;
        right: initial;
        right: 0;
        bottom: -45px;
      }
    }
  }

  .initial-input {
    font-weight: 500;
    margin-bottom: 8px;
  }
</style>
