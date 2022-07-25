# Onyx Systems Package Protocal

## Summary

The package protocal will allow use to identify a chain of endpoints, and then navigate a request through multiple endpoints without having to make multiple requests from the original location. In order to achieve this the body of a request will specify information about the chain of endpoints, which data should be obtained or used by each.

## Structure

```
{
    pkg: {
        current_step: number,
        steps: {
            0: {
                query: "query_definition",
                command: "command_definition",
                deposit: step_to_deposit,
                data: {
                    deposited: any,
                    gathered: any,
                },
                next: "http://<host>/<endpoint>",
                completed: bool,
                errors: [],
                use_file: string,
                use_files: number[]
            },
        },
    }
    files: files_list
}
```

The body will consist of multipart/form-data, with the following keys:

- `pkg`: The package protocal.
- `files`: The files to be deposited.
