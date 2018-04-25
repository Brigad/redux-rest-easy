import normalizeURL from '../../../src/internals/utils/normalizeURL';

describe('normalizeURL', () => {
  test('no parameters', () => {
    expect(normalizeURL()).toBe('');
  });

  test('no URL', () => {
    expect(normalizeURL('actionName')).toBe('actionName');
  });

  test('no cacheHint', () => {
    expect(normalizeURL('actionName', 'https://url.co?test=1')).toBe(
      'actionName:https://url.co?test=1',
    );
  });

  test('all parameters', () => {
    expect(
      normalizeURL('actionName', 'https://url.co?test=1', {
        'Accept-Language': 'en-GB, fr-FR',
      }),
    ).toBe(
      'actionName:https://url.co?test=1:?Accept-Language=en-GB%2C%20fr-FR',
    );
  });
});
