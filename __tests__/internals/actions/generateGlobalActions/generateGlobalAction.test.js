import generateGlobalAction from '../../../../src/internals/actions/generateGlobalActions/generateGlobalAction';

const ACTION_TYPE = '@@rest-easy/@global/@reset/RESET_ALL';

describe('generateGlobalAction', () => {
  test('no args', () => {
    expect(generateGlobalAction()()).toMatchSnapshot();
  });

  test('happy path', () => {
    expect(generateGlobalAction(ACTION_TYPE)()).toMatchSnapshot();
  });
});
