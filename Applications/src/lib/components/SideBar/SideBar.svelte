<script>
  import Icon from "../../helpers/Icon/Icon.svelte";
  import { navigate } from "svelte-routing";
  import { currentPath } from "../../stores/env";
  import { logoutUser } from "../../helpers/functions/auth";

  const navigateLink = (link) => {
    navigate(link);
  };

  $: isMobile = () => {
    return window.innerWidth <= 768;
  };

  let visible = false;
</script>

{#if !isMobile() || visible}
  <div class="sidebar">
    <div class="logo-container">
      <Icon name="onyx-logo" width="152" />
    </div>
    <div class="nav-section">
      <div
        on:click={() => {
          navigateLink("/home");
          if (isMobile()) visible = false;
        }}
        class="nav-item {($currentPath === '/home' || $currentPath === '/') &&
          'active'}"
      >
        <i class="material-symbols-outlined">dashboard</i>
        <p>Home</p>
      </div>
      <div
        on:click={() => {
          navigateLink("/actions");
          if (isMobile()) visible = false;
        }}
        class="nav-item {$currentPath === '/actions' && 'active'}"
      >
        <i class="material-symbols-outlined">bolt</i>
        <p>Actions</p>
      </div>
      <!-- <div
      on:click={() => navigateLink("/graphics")}
      class="nav-item {$currentPath === '/graphics' && 'active'}"
    >
      <i class="material-symbols-outlined">data_usage</i>
      <p>Graphics</p>
    </div>
    <div
      on:click={() => navigateLink("/family")}
      class="nav-item {$currentPath === '/family' && 'active'}"
    >
      <i class="material-symbols-outlined">group</i>
      <p>People</p>
    </div>
    <div
      on:click={() => navigateLink("/news")}
      class="nav-item {$currentPath === '/news' && 'active'}"
    >
      <i class="material-symbols-outlined">feed</i>
      <p>News</p>
    </div>
    <div
      on:click={() => navigateLink("/apps")}
      class="nav-item {$currentPath === '/apps' && 'active'}"
    >
      <i class="material-symbols-outlined">apps</i>
      <p>Apps</p>
    </div>
    <div
      on:click={() => navigateLink("/robots")}
      class="nav-item {$currentPath === '/robots' && 'active'}"
    >
      <i class="material-symbols-outlined">precision_manufacturing</i>
      <p>Robots</p>
    </div> -->
    </div>
    <div class="nav-section">
      <div
        on:click={() => {
          navigateLink("/settings");
          if (isMobile()) visible = false;
        }}
        class="nav-item {$currentPath === '/settings' && 'active'}"
      >
        <i class="material-symbols-outlined">settings</i>
        <p>Settings</p>
      </div>
      <div
        on:click={() => {
          logoutUser();
        }}
        class="nav-item"
      >
        <i class="material-symbols-outlined">logout</i>
        <p>Logout</p>
      </div>
    </div>
  </div>
{/if}

<div
  class="burger"
  on:click={() => {
    visible = !visible;
  }}
>
  {#if !visible}
    <Icon name="menu" width="24px" height="24px" />
  {:else}
    <Icon name="close" width="24px" height="24px" color="#fc3a0a" />
  {/if}
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;

  .burger {
    position: fixed;
    top: 50vh;
    right: 14px;
    padding: 14px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @include tablet {
      top: 20px;
      right: 20px;
    }

    @include desktop {
      display: none;
    }
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    @include tablet {
      width: 300px;
      height: 100vh;
      top: 0;
      left: 0;
      bottom: 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    @include desktop {
      display: block;
      width: 224px;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 4px 0px 24px rgba(0, 0, 0, 0.05);
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 36px;
    margin-bottom: 82px;
  }
  .nav-section {
    margin-top: 36px;
    padding: 24px 0;
    border-top: 1px solid #eaeaea;
  }

  .nav-section:last-child {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .nav-item {
    background-color: white;
    color: $dark-blue;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 36px;
    height: 40px;
    margin-right: 14px;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    margin-bottom: 18px;

    &:hover {
      outline: 1px solid rgba($color: $dark-blue, $alpha: 0.15);
    }

    i {
      margin-right: 14px;
    }

    p {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
  }

  .active {
    color: white;
    background-color: $dark-blue;
    box-shadow: 0.2px 0.2px 16px 0 rgba($color: #000000, $alpha: 0.25);
  }
</style>
