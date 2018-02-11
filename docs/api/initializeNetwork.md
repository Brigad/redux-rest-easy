# `initializeNetwork(networkHelpers)`

Overrides the built-in defaults for network handling.

#### Arguments

1. (_networkHelpers_): An object with the following properties, all optional:

* getToken
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
  // Mandatory if you don't override the others
  getToken: () => localStorage.getItem('token'),

  // Override to add custom headers
  requestGET() {
    return {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      },
    };
  },
  requestPATCH(body) {
    return {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body,
    };
  },
  requestPUT(body) {
    return {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body,
    };
  },
  requestPOST(body) {
    return {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body,
    };
  },
  requestDELETE() {
    return {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      },
    };
  },

  // Override to change status code / error handling
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
  // eslint-disable-next-line no-unused-vars
  handleError: async (err, dispatch) => {
    try {
      if (err && err.response) {
        const error = await err.response.json();

        // dispatch some action to warn the user about the error

        // eslint-disable-next-line no-console
        console.error(error);
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  },
};

initializeNetwork(networkHelpers);
```

#### Tips

* You should do this before any network request performs (usually at the entry point of your app)
* Only specifying `getToken` is often enough to make your app work. Use the other options if you needs custom headers or handlers!
