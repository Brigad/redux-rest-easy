import generateResourceActions from '../../../src/internals/actions/generateResourceActions';

describe('generateResourceActions', () => {
  test('only path', () => {
    expect(generateResourceActions()).toMatchSnapshot();
  });
});
