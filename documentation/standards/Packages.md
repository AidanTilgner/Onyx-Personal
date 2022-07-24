# Onyx Systems Package Protocal

## Summary

The package protocal will allow use to identify a chain of endpoints, and then navigate a request through multiple endpoints without having to make multiple requests from the original location. In order to achieve this the body of a request will specify information about the chain of endpoints, which data should be obtained or used by each.

## Structure

```
{
    current_step: number,
    steps: {
        0: {
            query: "query_definition",
            command: "command_definition",
            deposit: 1,
            data: {
                deposited: any,
                gathered: any,
            },
            next: "http://<host>/<endpoint>",
            completed: bool,
            errors: [],
            use_files: number[]
        }
    },
    files: files_list
}
```