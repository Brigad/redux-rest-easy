const DEFAULT_NETWORK_HELPERS = {
  getToken: () => 'token',
  async requestGET() {
    const token = await Promise.resolve(this.getToken && this.getToken())

    return {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    };
  },
  async requestPATCH(body) {
    const token = await Promise.resolve(this.getToken && this.getToken())

    return {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      body: JSON.stringify(body),
    };
  },
  async requestPUT(body) {
    const token = await Promise.resolve(this.getToken && this.getToken())

    return {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      body: JSON.stringify(body),
    };
  },
  async requestPOST(body) {
    const token = await Promise.resolve(this.getToken && this.getToken())

    return {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      body: JSON.stringify(body),
    };
  },
  async requestDELETE() {
    const token = await Promise.resolve(this.getToken && this.getToken())

    return {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        ...(this.getToken && this.getToken()
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    };
  },
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

const getDefaultNetworkHelpers = () => DEFAULT_NETWORK_HELPERS;

export default getDefaultNetworkHelpers;
