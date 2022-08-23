<script>
  import { currentAlert } from "../../stores/alerts";
  let currentAlertData = $currentAlert;

  currentAlert.subscribe((data) => {
    currentAlertData = data;
  });

  $: if (currentAlertData.timeout) {
    setTimeout(() => {
      currentAlertData = null;
      currentAlert.set({
        ...currentAlertData,
        show: false,
        message: null,
      });
    }, currentAlertData.timeout);
  }
</script>

{#if currentAlertData.show}
  <div class="alert {currentAlertData.type}">
    {#if currentAlertData.title?.length}
      <h4>{currentAlertData.title}</h4>
    {/if}
    <p>{currentAlertData.message}</p>
    <i
      class="material-icons close-button"
      on:click={(e) => {
        currentAlert.set({
          ...currentAlertData,
          show: false,
          message: null,
        });
      }}>close</i
    >
  </div>
{/if}

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

  .alert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 18px 24px;
    box-sizing: border-box;
    box-shadow: 0px 4px 24px 0 rgba(0, 0, 0, 0.35);
    z-index: 20;
    background-color: #242424;
    animation-name: open-animation;
    animation-duration: 1.2s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;

    h4 {
      margin: 0;
      margin-bottom: 14px;
      font-size: 24px;
      color: white;
      font-family: "Inter", sans-serif;
      font-weight: 300;
    }

    p {
      margin: 0;
      color: white;
      font-size: 16px;
    }
  }

  .success {
    background-color: $success-green;
  }

  .danger {
    background-color: $danger-red;
  }

  .close-button {
    position: fixed;
    top: 18px;
    right: 24px;
    font-size: 24px;
    color: white;
    cursor: pointer;
  }

  @keyframes open-animation {
    0% {
      transform: translateY(-20vh);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
