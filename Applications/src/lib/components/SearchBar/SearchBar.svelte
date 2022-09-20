<script>
</script>

<div class="searchbar">
  <input
    type="text"
    class="searchbar__input"
    placeholder="Search for anything"
  />
  <button class="searchbar__button">
    <i class="material-icons">arrow_forward</i>
  </button>
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;

  .searchbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    z-index: inherit;

    @include tablet {
      width: 50%;
    }
    &__input {
      width: 100%;
      padding: 14px 24px;
      border: 1px solid #eaeaea;
      font-family: "Quicksand", sans-serif;
      font-size: 14px;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border: 1px solid #2256f2;
      }
    }

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 5px;
      background-color: #2256f2;
      color: white;
      cursor: pointer;
      border: none;
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.25);
      position: absolute;
      top: calc(50% - 12px);
      right: 24px;

      i {
        font-size: 16px;
      }

      &:hover {
        box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.35);
      }
    }
  }
</style>
