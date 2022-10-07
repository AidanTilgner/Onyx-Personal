<script lang="ts">
  import { navigate } from "svelte-routing";

  const isMobile = window.innerWidth < 768;
  let expanded = isMobile ? false : true;
</script>

<div class="navbar">
  <h3 class="navbar__title">Onyx People Server</h3>
  {#if expanded}
    <div class="navbar__items">
      <button
        class="navbar__item"
        on:click={() => {
          navigate("/household");
        }}
      >
        Household
      </button>
    </div>
  {/if}
  <i
    class="navbar__dropdown-button material-icons"
    on:click={() => {
      expanded = !expanded;
    }}
  >
    {expanded ? "expand_less" : "expand_more"}
  </i>
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 24px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }

    &__title {
      font-size: 24px;
      font-weight: 500;
      font-family: $font-primary;
    }

    &__items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 24px;
      margin-top: 24px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: auto;
        margin-top: 0;
      }
    }

    &__item {
      font-size: 16px;
      font-weight: 500;
      font-family: $font-primary;
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid #000;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: #000;
        color: #fff;
      }
    }

    &__dropdown-button {
      position: absolute;
      right: 24px;
      top: 20px;
      padding: 5px;
      border-radius: 4px;
      border: 1px solid #000;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      @media (min-width: 768px) {
        display: none;
      }

      &:hover {
        background-color: #000;
        color: #fff;
      }
    }
  }
</style>
