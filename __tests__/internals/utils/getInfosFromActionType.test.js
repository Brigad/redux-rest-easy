import getInfosFromActionType from '../../../src/internals/utils/getInfosFromActionType';

describe('getInfosFromActionType', () => {
  test('only path', () => {
    const resourceName = 'fruits';
    const actionName = 'eat';
    const caseName = 'REQUEST';
    const actionType = `@@rest-easy/${resourceName}/${actionName}/${caseName}`;

    const result = getInfosFromActionType(actionType);

    expect(Object.keys(result).length).toBe(3);
    expect(result.resourceName).toBe(resourceName);
    expect(result.actionName).toBe(actionName);
    expect(result.caseName).toBe(caseName);
  });
});
