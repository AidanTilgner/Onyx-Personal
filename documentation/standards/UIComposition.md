# UI Composition

## Summary

This document will contain common standards for Onyx Systems composite UI's to follow.

## Frontend UI Composition

The Onyx Frontend UI will be composed of a number of widgets, each corresponding to a specific service or task. Because these widgets will be interfacing with a specific service, the development of each widget will be handled by the service itself. That means a widget that records audio and sends it to the Speech server for further use, will be handled by the Speech server. Even though that audio will then be used to generate an NLU response, the most direct service to that UI component is the Speech server.

Because each service will contain many different UI components, each service will have to have a way of storing and sending each widget to the frontend. Each service will follow a specific endpoint schema to make frontend development simple:
`https://service.example.com/widgets/widget_id`

This endpoint will send the widge to the frontend in the form of a JavaScript bundle file. The bundle file will contain a way to define the root that the widget will be rendered in, as well as the widget itself, and any logic that the widget needs. The widget has to be pure javascript or wasm, that way no coupling logic is needed to render it to the DOM.

The Application itself will have a Context API hook that widgets can tap into to get information about the application. This will allow the widget to know what it is rendering in the DOM, and what it is listening to. This way the widget can be developed completely independently of the application, but also get access to the application's state, and share state with other components that might need it.

An example implementation of the Context API hook will look like as follows:

```js
const { getStores, actions, events, elements } = useContext();
```

As you can see, the `useContext()` method will be globally available within the host page, and therefore will be globally accessible to any javascript bundle that wants to use it.

`getStores` will be a method that returns an object of all of the stores available to the widget. If the widget wants to access a specific store withing that object, they can pass a string to the method, and the method will return the store. By default however, the method will return the entire object. We will need to figure out how to secure this by validating bundles that are being sent to the frontend. Each store object will contain `subcribe`, `set`, and `update` methods. That way we can add reactivity by alerting widgets to changes in the store. In order to decrease coupling however, what actions happen as a result of store updates will be handled by the widget itself.

`actions` will allow widgets to make complex changes to the application that aren't possible via stores. The `actions` method will have a `register` and `dispatch` method as a return value of the object, actions can then be added and dispatched via this api. This means actions like making calls to the backend, or updating stylings accross widgets, anything really can be implemented by this combination of action registers and dispatches.

`events` will allow widgets to log messages to the application state, which will be handled by the server as opposed to the client side application. This will be useful for event driven development, or for debugging. The `logs` method will have a `register` method, which will let the widget register an event that it can use later via the `publish` method, the event will require a type to be referenced later. The `publish` method will take an event type and any arguments that could be used by functions that are subscribed to it. There will also be a `subscribe` method in the events object that takes a type, and a callback function that will be called when the event is published.

Though this combination of methods has a lot of redundancy, this is purposeful and will allow for the building of complex applications that aren't tightly coupled. By providing many ways to do a certain thing, we're allowing the application to be flexible and extensible.
