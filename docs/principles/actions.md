# Action

This process defines the set of steps performed by `redux-rest-easy` actions, from the moment the request is performed to the moment we receive the payload.

See [createResource documentation](../api/createResource.md#arguments) for the list of action parameters.

### Dispatch the REQUEST action

Dispatching the **REQUEST** action will trigger the corresponding reducer, and create a key in the store corresponding to the normalized URL of the request, with metadata useful to cache control and selectors. See [reducers documentation](./reducers.md#request).

### Execute the beforeHook

Specifying an _optional_ function `action.beforeHook` when defining an action will allow executing this function everytime the preflight checks are passed for this action. If it returns a non-falsy value, the return value will be used as the body for the principal request. Useful to perform series of calls.

### Perform the request

The request will be performed using `fetch`, using the URL `action.url` specified when defining the action, and the query parameters/body specified when dispatching the action.

### Receive and treat the payload of the request

The status code of the answer will be handled, then the payload will be processed to JSON.

### Normalize the payload

The payload will be normalized using _optional_ function `action.normalizer` if there is one (and if the request succeeded). The payload will otherwise be stored as-is.

The payload metadata will be extracted using _optional_ function `action.metadataNormalizer` if there is one (and if the request succeeded).

### Dispatch the RECEIVE / FAIL action

Dispatching the **RECEIVE** action will trigger the corresponding reducer and store the normalized data in the state. See [reducers documentation](./reducers.md#receive).

Dispatching the **FAIL** action will trigger the corresponding reducer and update the normalized URL metadata. See [reducers documentation](./reducers.md#fail).

### Execute the afterHook

Specifying an _optional_ function `action.afterHook` when defining an action will allow executing this function every time a request has successfully performed.

### Execute the onSuccess/onFailure

Last but not least, specifying a `onSuccess` / `onFailure` parameter when dispatching an action (e.g. from a component) will provide a way to specify callbacks at the component level, and to adapt the UI accordingly. See [actions documentation](../api/createResource/actions.md#actions).
