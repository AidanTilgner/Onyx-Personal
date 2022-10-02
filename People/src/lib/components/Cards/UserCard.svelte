<script lang="ts">
  export let username: string, role: string;
  import { navigate } from "svelte-routing";
</script>

<div class="user-card" on:click={() => navigate("/household/" + username)}>
  <div class="user-card__avatar">
    <img
      src="https://avatars.dicebear.com/api/avataaars/${username}.svg"
      alt="avatar"
    />
  </div>
  <div class="user-card__info">
    <h3 class="user-card__info__username">{username}</h3>
    <p class="user-card__info__role">{role}</p>
  </div>
</div>

<style lang="scss">
  .user-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      transform: scale(1.02);
    }

    &__avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 16px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__info {
      &__username {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 4px;
      }

      &__role {
        font-size: 0.875rem;
        font-weight: 400;
        color: var(--text-02);
      }
    }
  }
</style>
