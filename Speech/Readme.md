# Onyx Speech Server

## Summary

The Speech Server is responsible for handling all speech input from the user. It will then route that speech to the Interpretation Server to be interpreted, and later executed by the Action Server. Because it will be using a lot of AI models, it will be utilizing languages like python for ease of use, but integration with faster languages like Rust and Go might be essential to speed up it's performance.
