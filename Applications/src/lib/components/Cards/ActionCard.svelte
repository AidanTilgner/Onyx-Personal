<script>
  import Arrow from "../Buttons/Arrow.svelte";
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
        .catch((err) => console.log(err));
      console.log("Res: ", response);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    console.log("Clicking action");
    await prefetchActionMetaData();
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
    <span>{formattedAction()}</span>
    <Arrow title="Dispatch action" />
  </div>
</div>

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

    &:hover {
      box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.2);
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

    span {
      margin-right: 8px;
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
