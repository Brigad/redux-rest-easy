import safeCall from '../../../src/internals/utils/safeCall';

describe('safeCall', () => {
  test('first arg not a function', () => {
    expect(safeCall()).toBeUndefined();
    expect(safeCall(null)).toBeUndefined();
    expect(safeCall('')).toBeUndefined();
    expect(safeCall(0)).toBeUndefined();
  });

  test('one arg', () => {
    expect(safeCall(() => 2)).toBe(2);
  });

  test('several args', () => {
    expect(safeCall(arg => arg, 1)).toBe(1);
    expect(safeCall((a, b) => a + b, 1, 2)).toBe(3);
    expect(safeCall((a, b, c) => a + b + c, 1, 2, 3)).toBe(6);
  });
});
