# Preflight checks

Before performing a request, the library will check whether it should, based on logic and cache control.

### Should perform

Here are the conditions that would immediately cancel a request:

| Request method | Condition                                                                    | Explanation                                                                                                                                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET            | An identical request (same URL, same query parameters) is already performing | We will receive the payload of the first request sooner than the payload of the second, and there is no reason they should differ                                                                                                                                                 |
| POST           | An identical request (same URL) is already performing                        | We didn't find a way to effectively monitor POST requests. For a given resource, they have the same URL, and often the same body. However, tou can use [cache hints](../api/createResource/actionsConfig.md#properties) to differentiate multiple POST requests with the same URL |
| PATCH          | An identical request (same URL) is already performing                        | The second request might be based on outdated info, which will be updated when we receive the payload of the first request                                                                                                                                                        |
| PUT            | An identical request (same URL) is already performing                        | Same as for PATCH                                                                                                                                                                                                                                                                 |
| DELETE         | An identical request (same URL) is already performing                        | A resource can only be deleted once                                                                                                                                                                                                                                               |

### Cache control

And here are the conditions that would cancel a request based on cache control:

| Request method | Condition                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET            | - The exact same request has succeeded and its cache is still valid<br />- The request is about a resource/id pair which has already been retrieved, and the cache is still valid |
| POST           | No cache                                                                                                                                                                          |
| PATCH          | No cache                                                                                                                                                                          |
| PUT            | No cache                                                                                                                                                                          |
| DELETE         | No cache                                                                                                                                                                          |
