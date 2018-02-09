import hash from '../../../src/internals/utils/hash';

describe('hash', () => {
  test('invalid parameters', () => {
    expect(hash()).toBe(hash(null));
    expect(hash()).toBe(hash(false));
    expect(hash()).toBe(hash(''));
  });

  test('valid parameters', () => {
    const obj1 = {
      a: 1,
      b: 2,
    };

    const obj2 = {
      b: 2,
      a: 1,
    };

    expect(hash(obj1)).toBe(hash(obj1));
    expect(hash(obj1)).toBe(hash(obj2));
  });
});
