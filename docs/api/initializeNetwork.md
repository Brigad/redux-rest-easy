# `initializeNetwork(networkHelpers)`

Overrides the built-in defaults for network handling.

#### Arguments

1. (_networkHelpers_): An object with the following properties:

* requestGET
* requestPATCH
* requestPUT
* requestPOST
* requestDELETE
* handleStatusCode
* handleError

#### Example

```js
import { initializeNetwork } from '@brigad/redux-rest-easy';

const networkHelpers = {
  requestGET: () => ({
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer token`,
    },
  }),
  requestPATCH: body => ({
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer token`,
      'Content-Type': 'application/json',
    },
    body,
  }),
  requestPUT: body => ({
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer token`,
      'Content-Type': 'application/json',
    },
    body,
  }),
  requestPOST: body => ({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer token`,
      'Content-Type': 'application/json',
    },
    body,
  }),
  requestDELETE: () => ({
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer token`,
    },
  }),
  handleStatusCode: response => {
    if (response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }

    return null;
  },
  handleError: () => async (err, dispatch) => {
    try {
      if (err && err.response) {
        const error = await err.response.json();

        if (dispatch) {
          dispatch(showAPIError());
        } else {
          alert(error.message);
        }
      } else {
        console.error(err);
      }
    } catch (e) {
      console.error(e);
    }
  },
};

initializeNetwork(networkHelpers);
```

#### Tips

* You should do this before any network request performs (usually at the entry point of your app)
