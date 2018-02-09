import getState from '../../../src/internals/utils/getState';

/* eslint-disable no-console */

const INITIAL_CONSOLE_ERROR = console.error;

const VALID_STATE = {
  restEasy: {},
};

describe('getState', () => {
  let mockConsoleError;

  beforeEach(() => {
    mockConsoleError = jest.fn();
    console.error = mockConsoleError;
  });

  afterEach(() => {
    console.error = INITIAL_CONSOLE_ERROR;
  });

  test('invalid state', () => {
    expect(getState()).toBeNull();
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(getState({})).toBeNull();
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
  });

  test('valid state', () => {
    expect(getState(VALID_STATE)).toBe(VALID_STATE.restEasy);
  });
});
