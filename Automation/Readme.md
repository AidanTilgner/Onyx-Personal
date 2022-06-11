# Onyx Automation Server

## Summary

The Automation server will be responsible for managing all of the automated tasks of the system. Things like preparing my morning brief for the day or making sure to feed the cats. Actions designed to happen on a set interval will happen here.

## Architecture and Design

As a Server responsible for running the main interval based tasks and services, the Automation Server will not be taking many requests, but will be sending requests to other services to handle many tasks. Because of this, the Automation Server will be mostly event based, that way it can keep track of what it has done and what needs to be done, as well as so that asynchronous tasks being handled by other servers can be managed better. We can divide each task/event into two parts, a submission and a completion. The submission will be the initial publishing of the event, and the completion will be published to the ledger when the event has been completed. Each event should have a unique id, and if an event doesn't have a submission/completion pair, it will be assumed that it has not been completed. If an exception occurs during the completion of an event, the event will instead be marked as failed, and the exception will be logged.

The task/event will also have a corresponding package, which will contain the data to complete the task, the path that the task needs to follow to be completed, and other metadata to be used by whatever service that is handling the task. When an event is published, the corresponding package will be dispatched and make its way throughout the system.
