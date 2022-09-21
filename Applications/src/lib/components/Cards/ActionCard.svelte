<script>
  import Icon from "../Buttons/Icon.svelte";
  import Modal from "../Modals/Default.svelte";

  export let width = "100%",
    action = "",
    custom_style = "",
    onClick = () => {};

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const formattedAction = () => {
    const [actionType, actionValue] = action.split(".");
    let formatted = "";
    if (actionValue === "default") {
      formatted += actionType
        .replace(/[_-]/g, " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    } else {
      formatted += actionValue
        .replace(/[_-]/g, " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    if (formatted.length > 12) {
      formatted = formatted.slice(0, 12) + "...";
    }

    return formatted;
  };

  let modalOpen = false;

  const prefetchActionMetaData = async () => {
    try {
      const response = await fetch(`/api/proxy/actions/metadata/${action}`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    const res = await prefetchActionMetaData();
    modalOpen = true;
    onClick(e);
  };
</script>

<div
  class="card"
  style={`width: ${isMobile() ? "100%" : width};${custom_style}`}
  on:click={handleClick}
  tabindex="0"
  on:keypress={(e) => {
    if (e.key === "Enter") {
      handleClick(e);
    }
  }}
  title={action}
>
  <div class="body">
    <div class="body__text">
      <p>{formattedAction()}</p>
    </div>
    <Icon title="Dispatch action" button="bolt" />
  </div>
</div>
{#if modalOpen}
  <Modal
    title={action}
    buttons={[
      {
        text: "Close",
        onClick: () => {
          modalOpen = false;
        },
        type: "outline",
      },
      {
        text: "Dispatch",
        onClick: () => {
          modalOpen = false;
        },
        type: "primary",
      },
    ]}
  >
    <div class="modal__body">
      <p>{action}</p>
    </div>
  </Modal>
{/if}

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

  .card {
    background-color: #fff;
    border-radius: 0px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    // border: 1px solid $cool-blue;
    cursor: pointer;
    transition: all 0.2s ease;
    // width: 100%;

    &:hover {
      box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.2);
      border-radius: 5px;
    }

    &:active {
      animation-name: clickedCard;
      animation-duration: 0.2s;
      animation-fill-mode: forwards;
    }
  }

  .body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: $cool-blue;

    &__text {
      display: flex;
      align-items: center;
      margin-right: 8px;
      width: 50%;

      i {
        margin-right: 8px;
      }

      p {
        margin: 0;
        padding: 0;
        white-space: nowrap;
      }
    }
  }

  @keyframes clickedCard {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
