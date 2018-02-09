import generateActionCreatorActionTypes from '../../../../src/internals/actions/generateActionCreatorActions/generateActionCreatorActionTypes';

describe('generateActionCreatorActionTypes', () => {
  test('only path', () => {
    expect(generateActionCreatorActionTypes('fruits', 'eat')).toMatchSnapshot();
  });
});
