import generateActionCreatorAction from '../../../../src/internals/actions/generateActionCreatorActions/generateActionCreatorAction';

const ACTION_TYPE = '@@rest-easy/fruits/eat/REQUEST';
const NORMALIZED_URL = 'eat:https://api.co/fruits';
const ID = '2';
const ARRAY_ID = [ID];

describe('generateActionCreatorAction', () => {
  test('no args', () => {
    expect(generateActionCreatorAction()()).toMatchSnapshot();
  });

  test('no url, id, payload', () => {
    expect(generateActionCreatorAction(ACTION_TYPE)()).toMatchSnapshot();
  });

  test('no id, payload', () => {
    expect(
      generateActionCreatorAction(ACTION_TYPE)(NORMALIZED_URL),
    ).toMatchSnapshot();
  });

  test('no payload', () => {
    expect(
      generateActionCreatorAction(ACTION_TYPE)(NORMALIZED_URL, ID),
    ).toMatchSnapshot();
  });

  test('empty payload', () => {
    expect(
      generateActionCreatorAction(ACTION_TYPE)(NORMALIZED_URL, ID, {}),
    ).toMatchSnapshot();
  });

  test('filled payload without principalResourceIds', () => {
    const payload = {
      fruits: {
        1: 'cherry',
      },
    };

    expect(
      generateActionCreatorAction(ACTION_TYPE)(NORMALIZED_URL, ID, payload),
    ).toMatchSnapshot();
  });

  test('filled payload, string principalResourceIds', () => {
    const payload = {
      fruits: {
        1: 'cherry',
      },
    };

    expect(
      generateActionCreatorAction(ACTION_TYPE)(NORMALIZED_URL, ID, payload, ID),
    ).toMatchSnapshot();
  });

  test('filled payload, array principalResourceIds', () => {
    const payload = {
      fruits: {
        1: 'cherry',
      },
    };

    expect(
      generateActionCreatorAction(ACTION_TYPE)(
        NORMALIZED_URL,
        ID,
        payload,
        ARRAY_ID,
      ),
    ).toMatchSnapshot();
  });
});
