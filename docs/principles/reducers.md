# Reducers

Unlike traditional Redux apps, which have multiple reducers per resource, `redux-rest-easy` works with generic reducers.

The state is split into three keys: `requests`, `resources`, and `resolversHashes`. `requests` holds the metadata related to requests, `resources` holds the data, and `resolversHashes` holds the hashes used for re-reselect resolvers.

For extensive documentation on the effect of `redux-rest-easy` reducers on your state, see the [reducers documentation](../api/reducer/reducers.md).
