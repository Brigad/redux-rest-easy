import getPrunedForPersistenceState from './internals/persistence/getPrunedForPersistenceState';

const getPersistableState = (state, persistOptions) =>
  getPrunedForPersistenceState(state, persistOptions);

export default getPersistableState;
