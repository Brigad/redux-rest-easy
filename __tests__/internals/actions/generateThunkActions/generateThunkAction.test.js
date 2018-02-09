import generateThunkAction from '../../../../src/internals/actions/generateThunkActions/generateThunkAction';

const ACTION_TYPE = '@@rest-easy/fruits/eat/REQUEST';
const RESOURCE_NAME = 'fruits';

describe('generateThunkAction', () => {
  test('no args', () => {
    expect(generateThunkAction()()).toMatchSnapshot();
  });

  test('no resourceName', () => {
    expect(generateThunkAction(ACTION_TYPE)()).toMatchSnapshot();
  });

  test('happy path', () => {
    expect(generateThunkAction(ACTION_TYPE, RESOURCE_NAME)()).toMatchSnapshot();
  });
});
