import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    // TODO: Make this dynamic
    url: "localhost:3000",
  },
});

export default app;
