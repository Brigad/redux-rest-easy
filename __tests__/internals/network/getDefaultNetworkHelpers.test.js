import fetchMock from 'fetch-mock';

import getDefaultNetworkHelpers from '../../../src/internals/network/getDefaultNetworkHelpers';

const NETWORK_HELPERS = getDefaultNetworkHelpers();
const customGetTokenNetworkHelpers = {
  ...NETWORK_HELPERS,
  getToken: () => '',
};

describe('getDefaultNetworkHelpers', () => {
  test('all default', () => {
    expect(NETWORK_HELPERS).toMatchSnapshot();
  });

  test('custom getToken', () => {
    expect(customGetTokenNetworkHelpers).toMatchSnapshot();
  });
});

describe('requestGET', () => {
  test('all default', async () => {
    expect(await NETWORK_HELPERS.requestGET()).toMatchSnapshot();
  });

  test('custom getToken', async () => {
    expect(await customGetTokenNetworkHelpers.requestGET()).toMatchSnapshot();
  });
});

describe('requestPATCH', () => {
  test('all default', async () => {
    expect(await NETWORK_HELPERS.requestPATCH()).toMatchSnapshot();
  });

  test('custom getToken', async () => {
    expect(await customGetTokenNetworkHelpers.requestPATCH()).toMatchSnapshot();
  });
});

describe('requestPUT', () => {
  test('all default', async () => {
    expect(await NETWORK_HELPERS.requestPUT()).toMatchSnapshot();
  });

  test('custom getToken', async () => {
    expect(await customGetTokenNetworkHelpers.requestPUT()).toMatchSnapshot();
  });
});

describe('requestPOST', () => {
  test('all default', async () => {
    expect(await NETWORK_HELPERS.requestPOST()).toMatchSnapshot();
  });

  test('custom getToken', async () => {
    expect(await customGetTokenNetworkHelpers.requestPOST()).toMatchSnapshot();
  });
});

describe('requestDELETE', () => {
  test('all default', async () => {
    expect(await NETWORK_HELPERS.requestDELETE()).toMatchSnapshot();
  });

  test('custom getToken', async () => {
    expect(
      await customGetTokenNetworkHelpers.requestDELETE(),
    ).toMatchSnapshot();
  });
});

describe('handleStatusCode', () => {
  test('no response', () => {
    expect(NETWORK_HELPERS.handleStatusCode(null)).toBeNull();
  });

  test('invalid response', () => {
    const response = { status: 300 };

    expect(() => NETWORK_HELPERS.handleStatusCode(response)).toThrow();
  });

  test('valid response', () => {
    const response = { status: 200 };
    const response2 = { status: 299 };

    expect(NETWORK_HELPERS.handleStatusCode(response)).toBe(response);
    expect(NETWORK_HELPERS.handleStatusCode(response2)).toBe(response2);
  });
});

describe('handleError', () => {
  // eslint-disable-next-line no-console
  const INITIAL_CONSOLE_ERROR = console.error;
  let consoleErrorMock;

  beforeEach(() => {
    consoleErrorMock = jest.fn();
    // eslint-disable-next-line no-console
    console.error = consoleErrorMock;
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = INITIAL_CONSOLE_ERROR;
  });

  test('wrongly formatted error', async () => {
    const error = 'oh no';

    await NETWORK_HELPERS.handleError(error);

    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  });

  test('wrongly formatted error 2', async () => {
    const error = { response: 'oh no' };

    await NETWORK_HELPERS.handleError(error);

    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  });

  test('valid error', async () => {
    fetchMock.mock('error', {
      status: 400,
      body: {
        message: 'errorMessage',
      },
    });

    const res1 = await fetch('error');
    const error = new Error(res1.statusText);
    error.response = res1;

    fetchMock.restore();

    await NETWORK_HELPERS.handleError(error);

    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  });
});
