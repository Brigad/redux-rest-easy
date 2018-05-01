import isPlainObject from '../../../src/internals/utils/isPlainObject';

describe('isPlainObject', () => {
  test('not plain objects', () => {
    expect(isPlainObject()).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(false)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(0)).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject(-1)).toBe(false);
    expect(isPlainObject('')).toBe(false);
    expect(isPlainObject('hello')).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([''])).toBe(false);
    expect(isPlainObject([0])).toBe(false);
  });

  test('plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
  });
});
