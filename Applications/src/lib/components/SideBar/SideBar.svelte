<script>
  import Icon from "../../helpers/Icon/Icon.svelte";
  import { navigate } from "svelte-routing";
  import { currentPath } from "../../stores/env";

  const navigateLink = (link) => {
    navigate(link);
  };
</script>

<div class="sidebar">
  <div class="logo-container">
    <Icon name="onyx-logo" width="152" />
  </div>
  <div class="nav-items">
    <div
      on:click={() => navigateLink("/home")}
      class="nav-item {($currentPath === '/home' || $currentPath === '/') &&
        'active'}"
    >
      <i class="material-symbols-outlined">dashboard</i>
      <p>Home</p>
    </div>
    <div
      on:click={() => navigateLink("/actions")}
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
</div>

<style lang="scss">
  @use "../../styles/partials/mixins" as *;
  @use "../../styles/partials/variables" as *;
  .sidebar {
    display: none;
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
  }

  .nav-items {
    margin-top: 82px;
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
