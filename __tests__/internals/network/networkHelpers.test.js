import {
  getNetworkHelpers,
  setNetworkHelpers,
} from '../../../src/internals/network/networkHelpers';

describe('getNetworkHelpers', () => {
  test('without setting them', () => {
    expect(getNetworkHelpers()).toMatchSnapshot();
  });

  test('after setting them', () => {
    setNetworkHelpers({});

    expect(Object.keys(getNetworkHelpers()).length).toBe(0);
  });
});
