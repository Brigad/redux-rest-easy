import generateThunkActions from '../../../src/internals/actions/generateThunkActions';

describe('generateThunkActions', () => {
  test('only path', () => {
    const resourceName = 'fruits';
    const actionName = 'eat';
    const cacheLifetime = 0;
    const actionsConfig = {
      [actionName]: {
        method: 'GET',
        url: 'https://api.co/fruits',
      },
    };

    expect(
      generateThunkActions(
        resourceName,
        cacheLifetime,
        actionsConfig,
        actionName,
      ),
    ).toMatchSnapshot();
  });
});
