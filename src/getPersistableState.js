import getPrunedForPersistenceState from './internals/persistence/getPrunedForPersistenceState';

const getPersistableState = state => getPrunedForPersistenceState(state);

export default getPersistableState;
