import generateGlobalActions from '../../../src/internals/actions/generateGlobalActions';

describe('generateGlobalActions', () => {
  test('only path', () => {
    expect(generateGlobalActions()).toMatchSnapshot();
  });
});
