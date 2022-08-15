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
</div>

<style>
  h1 {
    font-size: 48px;
    font-family: "Quicksand", sans-serif;
    font-weight: 400;
    margin: 0;
    margin-top: 36px;
  }
</style>
