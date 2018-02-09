// TODO: manage token so that defaults can be used as-is. Right now they are just an example.
const DEFAULT_NETWORK_HELPERS = {
  requestGET: () => ({
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }),
  requestPATCH: body => ({
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  }),
  requestPUT: body => ({
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  }),
  requestPOST: body => ({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  }),
  requestDELETE: () => ({
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  }),
  handleStatusCode: (response) => {
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
          // dispatch some action to warn the user about the error
        } else {
          // eslint-disable-next-line no-alert
          alert(error.message);
        }
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

const getDefaultNetworkHelpers = () => DEFAULT_NETWORK_HELPERS;

export default getDefaultNetworkHelpers;
