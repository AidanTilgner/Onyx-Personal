# Onyx Applications Server

## Summary

The Applications server exists in order to host applications that utilize the Onyx system's functionality. This could be the dashboard that nearly directly controls the Onyx system, or a text editor that allows the user to create and edit text files used by the system. Because this will be communicating with different microservices in the Onyx system, and rendering UI elements sent by each microservice, the Applications server will be capable of handling lots of requests, and routing efficiently.

The Applications Server will also be responsible for taking UI and other elements of different services and condensing them into a single system.

## Design and Architecture

We're talking about combining multiple clients into one server, while also keeping each one reasonably independent to avoid coupling. In order to do this we will need to maintain a careful balance of orchestration by a central gateway server, and choreography between the various clients to create a seemless user experience. This will be done by creating a single gateway server that will be responsible for routing requests between the clients and different services.

Each application will also have a mix of services that it utilizes, which could include UI components. If this is the case, the application will allow for UI components to be built on the DOM and have access to a state maintained by the client and hooked into by the microservice. This will create a tunnel between the client and the microservice, and allow for communication without the gateway server. This could however introduce coupling if the application is not well designed, and therefore the design of the application needs to be able handle a complete seemless removal of communication with associated microservices.

As for each client. The gateway server will also be responsible for routing to each application, which will each exist in separate directories for organizational purposes. Ideally, there would only be the bundled <code>/build</code> directory for each application as to avoid multiple projects existing under this one microservice. So it's worth considering where to build and store application source code and whether or not to just send the correct <code>/build</code> files for the Applications Server to route to.

## Communication

Communication between the Applications Server and other microservices will mostly take place with the gateway server as a proxy, but the clients could also communicate directly with the gateway server, or the other microservices. Either way, we'll classify the communication as being under the Applications Server's domain. The various communications will be as follows:

**Actions Server**: (IN) The Actions Server will send requests to the Application Server if it has notifications or other datapoints to display on an application, such as Onyx Dashboard. (OUT) The Actions Server will be sent requests when certain buttons and/or input is detected by the UI. The Actions Server will then take an event as input and dispatch it accordingly.

**Automation Server**: (IN) The Automation Server will send requests to the Application Server if it has notifications or other datapoints to display on an application, such as Onyx Dashboard. (OUT) The Automation Server will be sent requests when certain buttons and/or input is detected by the UI. The Automation Server will then take that input and act accordingly, such as postponing an event or creating a new task.

**Awareness Server**: (IN) The Awareness Server will send requests to the Application Server if it has notifications or other datapoints to display on an application, such as Onyx Dashboard. (OUT) The Awareness Server will be sent requests when certain buttons and/or input is detected by the UI. The Awareness Server will then take that input and act accordingly, such as shifting attention or going on high alert.

**Collections Server**: (OUT) The Collections Server will be sent requests for data that will be used for graphics, insights, or other anylitics or applications. The Collections Server, being mostly read-only, won't be sending any requests to the Application Server.

**Images Server**: (IN) The Images Server will sometimes send requests to the Applications Server if it needs further input before executing an action, although this will be rare because either the Action Server or the Application Server will be the one initiating that request. (OUT) The Images Server will be sent requests when image or video information needs to be processed by the Application Server.

**Interpretation Server**: (IN) The Interpretation Server will send requests to the Application Server rarely, if it needs extra user input or information to complete an action. (OUT) The Interpretation Server will be sent requests when text from the user needs to be interpreted into action.

**Speech Server**: (OUT) The Speech Server will be sent requests when text needs to be spoken or when user speech needs to be translated into text. The Speech Server will not be sending any requests to the Application Server.

**Third Parties**: (IN) The Third Parties Server might have automated or socketed requests to Third Parties that will be interpreted and sent to the Applications Server for user viewablility. This however will usually happen with the Action Server acting as a proxy, and direct requests will be rare. (OUT) The Third Parties Server will be sent requests when third party API services are needed by the Actions Server.
