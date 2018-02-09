import getDefaultNetworkHelpers from '../../../src/internals/network/getDefaultNetworkHelpers';

const NETWORK_HELPERS = getDefaultNetworkHelpers();

describe('getDefaultNetworkHelpers', () => {
  test('only path', () => {
    expect(NETWORK_HELPERS).toMatchSnapshot();
  });
});

describe('requestGET', () => {
  test('only path', () => {
    expect(NETWORK_HELPERS.requestGET()).toMatchSnapshot();
  });
});

describe('requestPATCH', () => {
  test('only path', () => {
    expect(NETWORK_HELPERS.requestPATCH()).toMatchSnapshot();
  });
});

describe('requestPUT', () => {
  test('only path', () => {
    expect(NETWORK_HELPERS.requestPUT()).toMatchSnapshot();
  });
});

describe('requestPOST', () => {
  test('only path', () => {
    expect(NETWORK_HELPERS.requestPOST()).toMatchSnapshot();
  });
});

describe('requestDELETE', () => {
  test('only path', () => {
    expect(NETWORK_HELPERS.requestDELETE()).toMatchSnapshot();
  });
});

describe('handleStatusCode', () => {
  test('valid response', () => {
    const response = { status: 200 };
    const response2 = { status: 299 };

    expect(NETWORK_HELPERS.handleStatusCode(response)).toBe(response);
    expect(NETWORK_HELPERS.handleStatusCode(response2)).toBe(response2);
  });

  test('invalid response', () => {
    const response = { status: 300 };

    expect(() => NETWORK_HELPERS.handleStatusCode(response)).toThrow();
  });
});
