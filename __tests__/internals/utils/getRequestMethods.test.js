import getRequestMethods from '../../../src/internals/utils/getRequestMethods';

describe('getRequestMethods', () => {
  test('only path', () => {
    expect(getRequestMethods()).toMatchSnapshot();
  });
});
