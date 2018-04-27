import {
  areIdsEqual,
  payloadIdsInclude,
} from '../../../src/internals/utils/safeIds';

describe('areIdsEqual', () => {
  test('invalid number of parameters', () => {
    expect(areIdsEqual()).toBe(true);
    expect(areIdsEqual('1')).toBe(false);
    expect(areIdsEqual(1)).toBe(false);
  });

  test('string ids', () => {
    expect(areIdsEqual('1', '1')).toBe(true);
    expect(areIdsEqual('1', '2')).toBe(false);
    expect(areIdsEqual('2', '1')).toBe(false);
  });

  test('integer ids', () => {
    expect(areIdsEqual(1, 1)).toBe(true);
    expect(areIdsEqual(1, 2)).toBe(false);
    expect(areIdsEqual(2, 1)).toBe(false);
  });

  test('mixed ids', () => {
    expect(areIdsEqual(1, '1')).toBe(true);
    expect(areIdsEqual('1', 1)).toBe(true);
    expect(areIdsEqual('1', 2)).toBe(false);
    expect(areIdsEqual(1, '2')).toBe(false);
    expect(areIdsEqual('2', 1)).toBe(false);
    expect(areIdsEqual(2, '1')).toBe(false);
  });
});

describe('payloadIdsInclude', () => {
  test('invalid number of parameters', () => {
    expect(payloadIdsInclude()).toBe(false);
    expect(payloadIdsInclude([])).toBe(false);
    expect(payloadIdsInclude(['1', '2'])).toBe(false);
  });

  test('string ids', () => {
    expect(payloadIdsInclude([], '1')).toBe(false);
    expect(payloadIdsInclude(['1'], '1')).toBe(true);
    expect(payloadIdsInclude(['1'], '2')).toBe(false);
  });

  test('integer ids', () => {
    expect(payloadIdsInclude([], 1)).toBe(false);
    expect(payloadIdsInclude([1], 1)).toBe(true);
    expect(payloadIdsInclude([1], 2)).toBe(false);
  });

  test('mixed ids', () => {
    expect(payloadIdsInclude([1], '1')).toBe(true);
    expect(payloadIdsInclude(['1'], 1)).toBe(true);
    expect(payloadIdsInclude(['1'], 2)).toBe(false);
    expect(payloadIdsInclude([1], '2')).toBe(false);
  });
});
