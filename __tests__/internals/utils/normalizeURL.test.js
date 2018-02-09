import normalizeURL from '../../../src/internals/utils/normalizeURL';

describe('normalizeURL', () => {
  test('invalid parameters', () => {
    expect(normalizeURL()).toBe(':');
  });

  test('valid parameters', () => {
    expect(normalizeURL('actionName', 'https://url.co?test=1')).toBe(
      'actionName:https://url.co?test=1',
    );
  });
});
