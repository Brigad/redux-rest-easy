# Reducers

Unlike traditional Redux apps, which have multiple reducers per resource, `redux-rest-easy` works with generic reducers.

The state is split into two keys: `requests` and `resources`. `requests` holds the metadata related to requests, and `resources` holds the data.

For extensive documentation on the effect of `redux-rest-easy` reducers on your state, see the [reducers documentation](../api/reducer/reducers.md).
