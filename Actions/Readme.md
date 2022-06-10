# Onyx Action Server

## Summary

The Onyx Action Server is the main hub for all Onyx actions. It is responsible for receiving commands from any Onyx client, and then translating those commands into actions that can be performed by the Onyx system. Its scope will range from simple commands to complex ones, such as controlling a robot or a camera.

## Technologies

Because this could potentially be scaling highly, handling complex requests, and large amounts of data, efficiency and speed is key. Therefore, I will be
using Golang as the language for this project. I will be using the Iris framework for the web server. It's not as lightweight as other frameworks, but that is helpful as it allows for much more expanded functionality out of the box.

## Design and Architecture

The Action Server is going to be responsible for handling the main actions taken by the system, big to small. Because of this, it will need to use asynchronous tasks to handle the actions, and will use event driven programming to handle the communication with the client. When an event is published to the Action Server, a response will be sent to the client acknowledging that the event has been logged. If the action is classified as such, this response will also contain the result of the action and only one response will be necessary. If the action will take longer however, the first response will have a status of "pending" and the second response will have the result of the action.

So an event based architectural pattern will be used for the Action Server. This will also allow for logging of events to be done in a more efficient manner. Automation will be a separate server, but will publish events to the Action Server, and the action server will handle the actual action. Along with the Automation Server, the Awareness, Applications, Images, and Interpretation Servers will also be responsible for publishing events to the Action Server. This means that the Action Server needs to be flexible enough to handle all of the different types of events that can be published to it. There will need to be a specific event type for each of the different types of events that can be published to it.

Additionally, a schema for an event will be needed to promote consistency of input. This will increase flexibility of the action server but also allow for more efficient logging of events.

## Communications

The Action Server will communicate with multple other servers, probably more than any other. The communications with other servers will be listed as follows:

**Awareness Server**: (IN) The Awareness Server will publish events to the Action Server, and the Action Server will handle the actual action. The Awarness Server will pay attention and log responses from the Action Server. (OUT) The Awareness Server may also take requests from the Actions Server to pay attention to certain events based on user input.

**Applications Server**: (IN) The Applications Server will be hosting different apps, which will have interfaces that will indirectly publish events to the Action Server. The Applications Server will also have a gateway for different clients to publish to, and will handle sending those events to the Action Server. (OUT) The Action Server may also make requests to the applications server for things like User Input or sending notifications.

**Automation Server**: (IN) The Automation Server will be keeping track of and managing automated actions. Although it will be able to handle most automation itself, some of the actions will be handled by the Action Server. (OUT) In addition, the Automation Server may have some endpoints that will be used by the Action Server to handle unscheduled automated tasks.

**Collections Server**: (OUT) The Collections Server will be used to store and manage collections of data points that might be gathered by the Action Server. Therefore, the Action Server will be sending modifications and queries to the Collections Server.

**Images Server**: (IN) The Images Server will handle image related tasks, which could mean taking in gesture input publishing events to the Action Server accordingly. (OUT) The Action Server may send collected images and video to the Images Server for processing.

**Interpretation Server**: (IN) The Interpretation Server will take in plain text and translate it into actions that will be sent to the Action Server's <code>/webhook</code> endpoint. The Action Server will be responsible for understanding those actions and converting them into events that will be added to the event queue. (OUT) The Interpretation Server will also be responsible for handling requests from the Action Server to translate plain text into further actions.

**Speech Server**: (IN) The Speech Server will be capable of handling speech related tasks. It usually won't be publishing to the Action Server directly, but in the case of some commands it will, and the Action Server will be responsible for handling those commands. (OUT) The Speech Server will also be responsible for handling requests from the Action Server to translate speech into text or vice versa.

**Third Parties Server**: (IN) There will be very little communication on the part of the Third Parties Server to the Action Server, but if a websocket connection or some asynchronous task that requires a third party is used, it may contact the Action Server upon an event triggering. (OUT) The Third Parties Server will also be responsible for handling requests from the Action Server to communicate with third parties.
