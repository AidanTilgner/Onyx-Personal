<script>
  import { user } from "../../stores/user";

  let currUser = null;
  user.subscribe((data) => {
    currUser = data;
  });
</script>

<div class="header">
  <h1>Hello{currUser ? `, ${currUser.first_name}` : "There"}</h1>
</div>

<style lang="sass">

</style>
