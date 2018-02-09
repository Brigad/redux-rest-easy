import getActionNameFromNormalizedURL from '../../../src/internals/utils/getActionNameFromNormalizedURL';
import normalizeURL from '../../../src/internals/utils/normalizeURL';

describe('getActionNameFromNormalizedURL', () => {
  test('only path', () => {
    const actionName = 'eat';
    const url = 'https://api.co/fruits';

    const normalizedURL = normalizeURL(actionName, url);

    const result = getActionNameFromNormalizedURL(normalizedURL);

    expect(result).toBe(actionName);
  });
});
