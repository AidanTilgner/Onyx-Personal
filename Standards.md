# Onyx Systems Standards

## Summary

This document will contain common standards that all ONyx Systems will follow.

## Frontend UI Composition

The Onyx Frontend UI will be composed of a number of widgets, each corresponding to a specific service or task. Because these widgets will be interfacing with a specific service, the development of each widget will be handled by the service itself. That means a widget that records audio and sends it to the Speech server for further use, will be handled by the Speech server. Even though that audio will then be used to generate an NLU response, the most direct service to that UI component is the Speech server.

Because each service will contain many different UI components, each service will have to have a way of storing and sending each widget to the frontend. Each service will follow a specific endpoint schema to make frontend development simple:
`https://service.example.com/widgets/widget_id`
