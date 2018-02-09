import generateThunkActionTypes from '../../../../src/internals/actions/generateThunkActions/generateThunkActionTypes';

describe('generateThunkActionTypes', () => {
  test('only path', () => {
    expect(generateThunkActionTypes('fruits')).toMatchSnapshot();
  });
});
