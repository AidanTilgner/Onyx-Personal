<script>
  export let name;
  import { initSocket } from "./config/socket.io";
  import { messages } from "./stores/socket";

  initSocket();
  let messagesArray = [];
  messages.subscribe((data) => {
    console.log("Message received: ", data);
    messagesArray = [...messagesArray, data];
  });
</script>

<main>
  <div>
    {#each messagesArray as message}
      <p>{message}</p>
    {/each}
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
