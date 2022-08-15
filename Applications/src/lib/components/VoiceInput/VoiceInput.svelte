<script>
  import { voice_response } from "../../stores/socket";
  voice_response.subscribe((data) => {
    console.log(data);
  });

  const formatVoiceResponse = (data) => {
    if (!data) {
      return "";
    }
    const { custom_message } = JSON.parse(data);
    return custom_message;
  };

  let openResponse = true;

  $: console.log("Open response", openResponse);

  voice_response.subscribe((res) => {
    console.log("Voice response", res);
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
      {formatVoiceResponse($voice_response)}
    </div>
    <i
      class="material-icons close-button"
      on:click={() => {
        openResponse = false;
        voice_response.set(null);
      }}>close</i
    >
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
    z-index: 5;

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

    .close-button {
      position: fixed;
      bottom: 136px;
      right: 14px;
      padding: 14px;
      background-color: white;
      border-radius: 50%;
      box-shadow: 0.2px 0.2px 4px 0 rgba($color: #000000, $alpha: 0.1);
      color: $cool-blue;
      cursor: pointer;

      @include desktop {
        bottom: initial;
        right: initial;
        top: 120px;
        right: 56px;
      }
    }
  }

  .voice-response {
    background-color: white;
    border-radius: 0;
    margin: 36px 24px 120px 24px;
    width: 100%;
    padding: 24px 14px;
    font-size: 18px;
    text-align: left;
    font-weight: 400;
    box-shadow: 0.2px 0.2px 20px 0 rgba($color: #000000, $alpha: 0.15);
  }
</style>
