const widgets = [
  {
    name: "speech_input_button",
    host: "http://localhost:5000",
  },
];

let widgetElements = [];

export const getExternalWidgets = () => {
  return widgets.map((widget) => {
    // ! Widgets cannot append to body directly or it will mess up the app
    // ! Direct body manipulation at load time will mess up the svelte bundle
    const script = document.createElement("script");
    script.setAttribute("async", false);
    script.src = `${widget.host}/widgets/${widget.name}`;
    widgetElements.push(script);

    return script;
  });
};

export const setExternalWidgets = (widgets) => {
  widgets.forEach((widget) => {
    document.body.appendChild(widget);
  });
};
