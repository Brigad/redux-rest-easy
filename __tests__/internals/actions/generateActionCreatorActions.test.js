import generateActionCreatorActions from '../../../src/internals/actions/generateActionCreatorActions';

describe('generateActionCreatorActions', () => {
  test('only path', () => {
    expect(generateActionCreatorActions()).toMatchSnapshot();
  });
});
