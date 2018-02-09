# Reducers

Reducers are triggered by actions, and are the only way to modify the state. Let's see which reducers exist, and their effect on the state.

### REQUEST

Will add metadata corresponding to the normalized URL to the state.

```js
const state = {
  restEasy: {
    requests: {
      '[ACTION_NAME]:URL?QUERY': {
        resourceName: string,
        resourceId: any || null,
        startedAt: timestamp,
        endedAt: null,
        // Followings won't be overwritten is they already exist
        hasSucceeded: false,
        hasFailed: false,
        didInvalidate: false,
        fromCache: false,
      },
    },
  },
};
```

### RECEIVE

Will set the metadata to a success state, and store the resource.

```js
const state = {
  restEasy: {
    requests: {
      '[ACTION_NAME]:URL?QUERY': {
        endedAt: timestamp,
        hasSucceeded: true,
        hasFailed: false,
        didInvalidate: false,
        fromCache: false,
        payloadIds: {
          resource1: [any],
          ...,
        },
      },
    },
    resources: {
      resource1: {
        [id]: object,
        ...,
      },
      ...,
    },
  },
};
```

### FAIL

Will set the metadata to a an error state. `payloadIds` will remain unchanged.

```js
const state = {
  restEasy: {
    requests: {
      '[ACTION_NAME]:URL?QUERY': {
        endedAt: timestamp,
        hasSucceeded: false,
        hasFailed: true,
      },
    },
  },
};
```

### RECEIVE_FROM_CACHE

When requesting a couple of resource/id which is already in state and cache is still fresh, the request will be store din a success state with the property `fromCache` to **true**.

```js
const state = {
  restEasy: {
    requests: {
      '[ACTION_NAME]:URL?QUERY': {
        resourceName: string,
        resourceId: any,
        startedAt: timestamp,
        endedAt: timestamp,
        hasSucceeded: true,
        hasFailed: false,
        didInvalidate: false,
        fromCache: true,
        payloadIds: {
          resource1: [any],
        },
      },
    },
  },
};
```

### INVALIDATE_RESOURCE

Will set `didInvalidate` to **true** for each request related to the resource.

### INVALIDATE_ID

Will set `didInvalidate` to **true** for each request related to the resource/id.

### INVALIDATE_REQUEST

Will set `didInvalidate` to **true** for the related request.

### RESET_RESOURCE

Will **remove** the resource and related requests from the state.

### RESET_ALL

Will empty the state completely.
