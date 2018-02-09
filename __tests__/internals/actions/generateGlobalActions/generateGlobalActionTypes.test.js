import generateGlobalActionTypes from '../../../../src/internals/actions/generateGlobalActions/generateGlobalActionTypes';

describe('generateGlobalActionTypes', () => {
  test('only path', () => {
    expect(generateGlobalActionTypes()).toMatchSnapshot();
  });
});
