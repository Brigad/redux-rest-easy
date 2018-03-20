# `createResource(resourceName, options)(actions)`

Creates a resource and associated actions and selectors to interact with it

#### Arguments

1.  (_resourceName_): (`string`) The name under which the resource will be stored in the state
2.  (_options_): (`object`) An object containing additional, optional options for the resource:

    A. (_cacheLifetime_): (`number`, **default: 0**) The duration _(in seconds)_ for which the resource will be considered valid (from `0` - no cache - to `Infinity` - cached permanently)

    B. (_denormalizer_): (`(resourceIds, resources) : array<resources>`, **default null**) A function useful to denormalize nested objects which have been normalized by `actionName.normalizer` (e.g. via [normalizr](https://github.com/paularmstrong/normalizr/blob/master/docs/api.md#denormalizeinput-schema-entities))

3.  (_actions_): (`map<actionName:config>`) An object of configs with the following attributes:

```js
const resource = {
  [actionName]: {
    // Mandatory
    method: 'GET|POST|PATCH|PUT|DELETE',
    url: string || func,
    // Optional
    beforeHook: func,
    normalizer: func,
    afterHook: func,
    // Also optional. Override the built-in network helpers
    // and the ones you may have provided using initializeNetworkHelpers
    networkHelpers: {
      getToken: func,
      requestGET: func,
      requestPATCH: func,
      requestPUT: func,
      requestPOST: func,
      requestDELETE: func,
      handleStatusCode: func,
      handleError: func,
    },
  },
  ...
};
```

Extensive documentation on actions configuration can be found [here](./createResource/actionsConfig.md).

#### Returns

(_Object_): An object containing [actions](./createResource/actions.md) and [selectors](./createResource/selectors.md).

```js
const resource = {
  actions: object,
  selectors: object,
};
```

#### Example

This example demonstrates how to use `createResource` to create a sample resource, and then to export the reducers, actions and selectors.

```js
import { createResource } from '@brigad/redux-rest-easy';

const users = createResource('users', { cacheLifetime: 30 })({
  retrieve: {
    method: 'GET',
    url: 'https://my-api.com/users',
    beforeHook: () => console.log('About to retrieve users... Hang on!'),
  },
  retrieveById: {
    method: 'GET',
    url: 'https://my-api.com/users/::userId',
  },
  create: {
    method: 'POST',
    url: 'https://my-api.com/users',
    afterHook: () => console.log('User created!'),
    normalizer: ({ user }) => ({
      entities: { users: { [user.id]: user } },
      result: user.id,
    }),
  },
  edit: {
    method: 'PATCH',
    url: 'https://my-api.com/users/::userId',
  },
});

const {
  actions: {
    resource: {
      invalidate: invalidateUsers,
      invalidateId: invalidateUser,
      reset: resetUsers,
    },
    retrieve: { perform: retrieveUsers, invalidate: invalidateRetrieveUsers },
    retrieveById: { perform: retrieveUser, invalidate: invalidateRetrieveUser },
    create: { perform: createUser },
    edit: { perform: editUser },
  },
  selectors: {
    resource: { getResource: getAllUsers, getResourceById: getUserById },
    retrieve: {
      resource: {
        couldPerform: couldRetrieveAnyUsers,
        isPerforming: isRetrievingAnyUsers,
        hasSucceeded: hasRetrievedAnyUsers,
        hasFailed: hasFailedAnyUsers,
        couldPerformOnId: couldRetrieveUser,
        isPerformingOnId: isRetrievingUser,
        hasSucceededOnId: hasRetrievedUser,
        hasFailedOnId: hasFailedUser,
      },
      request: {
        getResource: getUsers,
        couldPerform: couldRetrieveUsers,
        isPerforming: isRetrievingUsers,
        hasSucceeded: hasRetrievedUsers,
        hasFailed: hasFailedUsers,
      },
    },
  },
} = users;

export {
  retrieveUsers,
  retrieveUser,
  createUser,
  editUser,
  invalidateUsers,
  invalidateUser,
  invalidateRetrieveUsers,
  invalidateRetrieveUser,
  getAllUsers,
  getAllUsersMap,
  getUserById,
  couldRetrieveAnyUsers,
  isRetrievingAnyUsers,
  hasRetrievedAnyUsers,
  hasFailedAnyUsers,
  couldRetrieveUser,
  isRetrievingUser,
  hasRetrievedUser,
  hasFailedUser,
  getUsers,
  getUsersMap,
  couldRetrieveUsers,
  isRetrievingUsers,
  hasRetrievedUsers,
  hasFailedUsers,
};
```

#### Tips

* The above example is very exhaustive, but you can export only what you really need
* Naming is a matter of personal preference, use what works for you
* You can alternately just export `users`, and spare yourself the trouble of mapping the names. Then just use the selectors like so: `users.selectors.resource.getResource()`. Again, use what works for you
