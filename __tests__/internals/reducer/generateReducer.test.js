import generateReducer from '../../../src/internals/reducer/generateReducer';

const INITIAL_STATE = {};
const REDUCER = generateReducer(INITIAL_STATE);

describe('generateReducer', () => {
  test('undefined initial state', () => {
    expect(Object.keys(generateReducer()()).length).toBe(0);
  });

  test('undefined state', () => {
    expect(REDUCER()).toBe(INITIAL_STATE);
  });

  test('no action', () => {
    expect(REDUCER(INITIAL_STATE)).toBe(INITIAL_STATE);
  });

  test('non rest-easy action', () => {
    const action = {
      type: 'test',
    };

    expect(REDUCER(INITIAL_STATE, action)).toBe(INITIAL_STATE);
  });

  test('invalid type step', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/TEST',
    };

    expect(REDUCER(INITIAL_STATE, action)).toBe(INITIAL_STATE);
  });

  test('happy path: REQUEST', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/REQUEST',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: RECEIVE', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/RECEIVE',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: FAIL', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/FAIL',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: INVALIDATE_RESOURCE', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/INVALIDATE_RESOURCE',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: INVALIDATE_ID', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/INVALIDATE_ID',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: INVALIDATE_REQUEST', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/INVALIDATE_REQUEST',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: RESET_RESOURCE', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/RESET_RESOURCE',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });

  test('happy path: RESET_ALL', () => {
    const action = {
      type: '@@rest-easy/fruits/eat/RESET_ALL',
    };

    expect(REDUCER(INITIAL_STATE, action)).not.toBe(INITIAL_STATE);
  });
});
