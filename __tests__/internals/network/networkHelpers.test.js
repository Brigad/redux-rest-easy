import {
  getNetworkHelpers,
  setNetworkHelpers,
} from '../../../src/internals/network/networkHelpers';

describe('getNetworkHelpers', () => {
  test('without setting them', () => {
    expect(getNetworkHelpers()).toMatchSnapshot();
  });

  test('after setting them', () => {
    const tokenName = 'customToken';

    setNetworkHelpers({
      getToken: () => tokenName,
    });

    expect(getNetworkHelpers().getToken()).toBe(tokenName);
    expect(getNetworkHelpers().requestGET().headers.Authorization).toBe(
      `Bearer ${tokenName}`,
    );
  });
});
