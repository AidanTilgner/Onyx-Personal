# Onyx Interpretation Server

## Summary

The Interpretation Server is responsible for converting text to actions. This means using NLU frameworks like Rasa to interpret user text input. This will also be capable of handling direct user commands by detecting keywords in the user's input. This interpreted text will then be sent to the Action Server to be executed.

## Ideas:

- Convert this to a Golang server that wraps the javascript code.
- Create a text input widget for use in the dashboard
- Create a CLI widget for the dashboard
- Make an interface for the dictionary to add and edit mappings
