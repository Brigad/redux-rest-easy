import getPrunedForPersistenceState from '../../../src/internals/persistence/getPrunedForPersistenceState';

describe('getPrunedForPersistenceState', () => {
  test('invalid state', () => {
    expect(Object.keys(getPrunedForPersistenceState()).length).toBe(0);
    expect(Object.keys(getPrunedForPersistenceState(null)).length).toBe(0);
  });

  test('empty state', () => {
    expect(Object.keys(getPrunedForPersistenceState({})).length).toBe(0);
  });
});
