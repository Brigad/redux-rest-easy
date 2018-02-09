import generateResourceActionTypes from '../../../../src/internals/actions/generateResourceActions/generateResourceActionTypes';

describe('generateResourceActionTypes', () => {
  test('only path', () => {
    expect(generateResourceActionTypes('fruits')).toMatchSnapshot();
  });
});
