<script>
  import { user } from "../../stores/user";

  let currUser = null;
  user.subscribe((data) => {
    currUser = data;
  });
</script>

<div class="header">
  <h1 class="header_title">
    Hello{currUser ? `, ${currUser.first_name}` : "There"}
  </h1>
  <h3>How can I be of service today?</h3>
</div>

<style lang="scss">
  @use "../../styles/partials/variables" as *;
  @use "../../styles/partials/mixins" as *;
  h1 {
    font-size: 48px;
    font-family: $primary-font;
    font-weight: 400;
    margin: 0;
    margin-top: 36px;
    color: $dark-blue;
    text-align: left;

    @include desktop {
      text-align: left;
    }
  }

  h3 {
    font-family: $secondary-font;
    font-size: 24px;
    font-weight: 400;
    margin: 0;
    margin-top: 14px;
    margin-bottom: 36px;
    font-weight: 300;
    color: $cool-blue;
    text-align: left;

    @include desktop {
      text-align: left;
    }
  }
</style>
