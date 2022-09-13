<script>
  import Base from "./Base.svelte";
  import Arrow from "../Buttons/Arrow.svelte";
  export let width = "100%",
    action = "";

  const formattedAction = () => {
    const [actionType, actionValue] = action.split(".");
    if (actionValue === "default") {
      // Replace _ and - with spaces
      // Capitalize first letter of each word
      return actionType
        .replace(/[_-]/g, " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
    return actionValue
      .replace(/[_-]/g, " ")
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };
</script>

<Base {width} custom_style={"border: 1px solid #2256f2;"}>
  <div class="body">
    {formattedAction()}
    <Arrow title="Dispatch action" />
  </div>
</Base>

<style lang="scss">
  @use "../../styles/partials/variables" as *;

  .body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: $cool-blue;
  }
</style>
