# Onyx Action Server

## Summary

The Onyx Action Server is the main hub for all Onyx actions. It is responsible for receiving commands from any Onyx client, and then translating those commands into actions that can be performed by the Onyx system. Its scope will range from simple commands to complex ones, such as controlling a robot or a camera.

## Technologies

Because this could potentially be scaling highly, handling complex requests, and large amounts of data, efficiency and speed is key. Therefore, I will be
using Golang as the language for this project. I will be using the Iris framework for the web server. It's not as lightweight as other frameworks, but that is helpful as it allows for much more expanded functionality out of the box.
