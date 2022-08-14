<script>
  import { initSocket } from "./config/socket.io";
  import { getExternalWidgets } from "./config/external_widgets";
  import { messages } from "./stores/socket";
  import { onMount } from "svelte";

  const initialized = initSocket();
  let messagesArray = [];
  messages.subscribe((data) => {
    console.log("Message received: ", data);
    messagesArray = [...data];
  });

  $: if (initialized) {
    const widgets = getExternalWidgets();
    console.log("Widgets: ", widgets);
    widgets.forEach((widget) => {
      document.body.appendChild(widget);
    });
  }

  $: console.log("Messages: ", messagesArray);
</script>

<main>
  <div id="container-speech_input" class="external-widget" />
  <div>Here is some additional stuff {messagesArray.length}</div>
  <div>
    {#each messagesArray as message}
      {console.log("messagesArray: ", messagesArray, messagesArray.length)}
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
