# `actionsConfig`

Map of `<actionName:config>` which defines the actions you will be able to perform on a resource.

#### Properties

1.  (_method_) **mandatory**: (`string`) The method of the action. Can be one of: `GET`, `PATCH`, `PUT`, `POST`, `DELETE`.
2.  (_url_) **mandatory**: (`string || () : string`) The URL on which the action has to fetch. For dynamic parameters, prefix them with `::` for the resource ID (e.g. `::userId`), and `:` for other parameters (e.g. `:userType`), and they will get replaced with the `urlParams` you will provide (see [actions documentation](./actions.md#properties)).
3.  (_cacheHint_): (`(urlParams, query, body, otherArgs) : object`) A function which will be invoked to generate a cache hint, appended to the formatted URL for caching purpose. It is expected to return an object of serializable values.
4.  (_beforeHook_): (`(urlParams, query, body, otherArgs, dispatch) : undefined || any`) A hook which can be invoked just before performing the request. Will be awaited if async. If it returns a non-falsy value, the return will be used as the body for the principal request.
5.  (_normalizer_): (`(payload, resources, urlParams, query, body, otherArgs) : { entities: normalizedPayload, result: principalResourceId }`) A function which will be invoked to normalize the payload of the request. It is expected to return an object with `entities` and `result`, respectively containing the normalized payload and the sorted ids, just as [normalizr](https://github.com/paularmstrong/normalizr) does.
6.  (_metadataNormalizer_): (`(payload, resources, urlParams, query, body, otherArgs) : object`) A function which will be invoked to extract metadata from the payload (if any). It is expected to return an object, which will be available via a selector.
7.  (_afterHook_): (`(normalizedPayload, urlParams, query, body, otherArgs, dispatch) : undefined`) A hook which can be invoked after performing the request and normalizing the payload. Will be awaited if async.
8.  (_networkHelpers_): (`map<string|func>`) A map of handlers used when performing network requests. Override the default ones, and the ones specified using `initializeNetworkHelpers`. Documentation on the content of the map can be found [here](../initializeNetworkHelpers.md#arguments).

#### Example

This example demonstrates a sample `actionsConfig`.

```js
const actionsConfig = {
  create: {
    // Mandatory
    method: 'GET',
    url: 'https://api.co/users/:userType/::userId/infos',
    // Optional
    beforeHook: (body, query, otherArgs, dispatch) =>
      console.log(
        'User infos retrieved with query: ',
        query,
        'and with custom property: ',
        otherArgs.property,
      ),
    normalizer: ({ user }) => ({
      entities: { users: { [user.id]: user } },
      result: user.id,
    }),
    metadataNormalizer: ({ _meta }) => _meta,
    afterHook: (
      normalizedPayload,
      urlParams,
      query,
      body,
      otherArgs,
      dispatch,
    ) => {
      if (Object.values(normalizedPayload.users)[0].isCompleted) {
        return dispatch(someAction());
      } else {
        console.log(otherArgs.otherProperty);
      }
    },
    networkHelpers: {
      getToken: () => 'custom_token',
    },
  },
};
```

#### Tips

* Returning a promise in a hook will make the execution wait for it to complete before continuing
