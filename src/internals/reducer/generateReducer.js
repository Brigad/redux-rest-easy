import getInfosFromActionType from '../utils/getInfosFromActionType';
import getReducerCases from './generateReducer/getReducerCases';

const DEFAULT_INITIAL_STATE = {};
const REDUCER_CASES = getReducerCases();

const generateReducer = (initialState = DEFAULT_INITIAL_STATE) => (
  state,
  action = {},
) => {
  if (state === undefined) {
    return initialState;
  }

  if (!action.type || !action.type.startsWith('@@rest-easy')) {
    return state;
  }

  const currentCase
    = REDUCER_CASES[getInfosFromActionType(action.type).caseName];

  if (!currentCase) {
    return state;
  }

  return currentCase(state, action);
};

export default generateReducer;
