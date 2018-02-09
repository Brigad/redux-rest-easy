import stringifyQueryParameters from '../../../src/internals/utils/stringifyQueryParameters';

describe('stringifyQueryParameters', () => {
  test('invalid object', () => {
    expect(stringifyQueryParameters()).toBe('');
    expect(stringifyQueryParameters(null)).toBe('');
    expect(stringifyQueryParameters({})).toBe('');
  });

  test('special case keys', () => {
    const queryObject = {
      a: undefined,
      b: null,
      c: '',
    };

    expect(stringifyQueryParameters(queryObject)).toBe('?b=&c=');
  });

  test('one key object', () => {
    const queryObject = {
      param: 'test',
    };

    expect(stringifyQueryParameters(queryObject)).toBe('?param=test');
  });

  test('multiple keys object', () => {
    const queryObject = {
      a: 1,
      b: '',
      c: 0,
      d: 'string',
    };

    expect(stringifyQueryParameters(queryObject)).toBe('?a=1&b=&c=0&d=string');
  });
});
