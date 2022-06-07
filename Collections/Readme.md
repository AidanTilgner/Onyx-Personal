# Onyx Collections Server

## Summary

The point of the collections server is to store and work with data that it is fed by the various other services. The system will be working with a lot of different data points, from REST apis to web crawling, there is plenty of data to store for later use. This could also possibly be used to store data that is not meant to be used by the system, but is useful for the user.

I'm not sure yet but there's a good chance that I'll be using a Publish/Subscribe method within the system, as well as Publish / Asyncronous methods. If those are the case, a central location for those will be useful, and the collections server, being data oriented, will be the obvious candidate.
