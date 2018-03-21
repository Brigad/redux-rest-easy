import {
  getNetworkHelpers,
  setNetworkHelpers,
} from '../../../src/internals/network/networkHelpers';

describe('getNetworkHelpers', () => {
  test('without setting them', () => {
    expect(getNetworkHelpers()).toMatchSnapshot();
  });

  test('after setting them', async () => {
    const tokenName = 'customToken';

    setNetworkHelpers({
      getToken: () => tokenName,
    });

    expect(getNetworkHelpers().getToken()).toBe(tokenName);
    expect((await getNetworkHelpers().requestGET()).headers.Authorization).toBe(
      `Bearer ${tokenName}`,
    );
  });


  test('after setting them - promise token', async () => {
    const tokenName = 'customToken';

    setNetworkHelpers({
      getToken: () => Promise.resolve(tokenName),
    });

    expect(await getNetworkHelpers().getToken()).toBe(tokenName);
    expect((await getNetworkHelpers().requestGET()).headers.Authorization).toBe(
      `Bearer ${tokenName}`,
    );
  });

});
