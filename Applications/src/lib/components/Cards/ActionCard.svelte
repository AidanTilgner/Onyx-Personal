<script>
  import Icon from "../Buttons/Icon.svelte";
  import Modal from "../Modals/Default.svelte";
  import Message from "../Modals/Message.svelte";

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

  const prefetchActionMetaData = async () => {
    try {
      const response = await fetch(`/api/proxy/actions/metadata/${action}`)
        .then((res) => res.json())
        .catch((err) => console.error(err));
      return response;
    } catch (err) {
      console.error(err);
    }
  };

  let modalOpen = false;
  let actionMetaData = null;

  const handleClick = async (e) => {
    const res = await prefetchActionMetaData();
    modalOpen = true;
    if (res.response?.expected_entities?.length > 0) {
      actionMetaData = res.response;
    }
    onClick(e);
  };

  const validateAction = () => {
    if (actionMetaData) {
      return actionMetaData.expected_entities.every((entity) => {
        return actionMetaData.completed_entities[entity.type];
      });
    }
    return true;
  };

  let actionResponse = null;

  const dispatchAction = async () => {
    const validated = validateAction();

    if (!validated) {
      alert("Please fill out all required fields");
      return;
    }

    const res = await fetch(`/api/proxy/actions/${action}`, {
      method: "POST",
      body: JSON.stringify({ entities: actionMetaData?.custom_entities }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));

    if (!res.response) {
      actionResponse = res;
    }

    if (res.response) {
      actionResponse = res.response;
    }
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
          dispatchAction();
        },
        type: "primary",
      },
    ]}
  >
    <div class="modal__body">
      {#if actionMetaData}
        {#each actionMetaData.expected_entities as entity}
          <div class="action-input">
            <label for={entity.type}>{entity.custom_query}</label>
            <input
              type="text"
              id={entity.type}
              placeholder={entity.type}
              on:change={(e) => {
                actionMetaData = {
                  ...actionMetaData,
                  completed_entities: {
                    ...actionMetaData.completed_entities,
                    [entity.type]: e.target.value,
                  },
                };
              }}
            />
          </div>
        {/each}
      {:else}
        <p>Are you sure?</p>
      {/if}
    </div>
  </Modal>
{/if}
{#if actionResponse}
  <Message
    buttons={[
      {
        text: "Close",
        onClick: () => {
          actionResponse = null;
        },
        type: "primary",
      },
    ]}
  >
    <div class="action-response">
      {#each Object.entries(actionResponse) as [key, value]}
        <div class="action-response__item">
          <p class="action-response__item__key">{key}</p>
          <p class="action-response__item__value">
            {typeof value === "object" ? JSON.stringify(value) : value}
          </p>
        </div>
      {/each}
    </div>
  </Message>
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
      box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.15);
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

  .modal__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;

    .action-input {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      margin-bottom: 14px;

      label {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 14px;
      }

      input {
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid $cool-blue;
        border-radius: 5px;
        outline: none;
        font-size: 14px;
        font-weight: 400;
        color: $cool-blue;
        font-family: $primary-font;
      }
    }
  }

  .action-response {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;

    &__item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      margin-bottom: 20px;

      &__key {
        font-size: 18px;
        font-weight: 500;
        margin: 0;
        margin-bottom: 14px;
        text-decoration: underline;
      }

      &__value {
        font-size: 18px;
        font-weight: 400;
        margin: 0;
        margin-bottom: 14px;
        // overflow should be ellipsis
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-align: left;
      }
    }
  }
</style>
