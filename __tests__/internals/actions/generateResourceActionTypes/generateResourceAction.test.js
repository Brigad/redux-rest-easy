import generateResourceAction from '../../../../src/internals/actions/generateResourceActions/generateResourceAction';

const ACTION_TYPE = '@@rest-easy/fruits/eat/REQUEST';
const RESOURCE_NAME = 'fruits';
const RESOURCE_ID = 2;

describe('generateResourceAction', () => {
  test('no args', () => {
    expect(generateResourceAction()()).toMatchSnapshot();
  });

  test('no resourceName, resourceId', () => {
    expect(generateResourceAction(ACTION_TYPE)()).toMatchSnapshot();
  });

  test('no resourceId', () => {
    expect(
      generateResourceAction(ACTION_TYPE, RESOURCE_NAME)(),
    ).toMatchSnapshot();
  });

  test('happy path', () => {
    expect(
      generateResourceAction(ACTION_TYPE, RESOURCE_NAME)(RESOURCE_ID),
    ).toMatchSnapshot();
  });
});
