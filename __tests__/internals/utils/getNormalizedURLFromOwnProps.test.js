import getNormalizedURLFromOwnProps from '../../../src/internals/utils/getNormalizedURLFromOwnProps';

/* eslint-disable no-console */

const INITIAL_CONSOLE_ERROR = console.error;

describe('getNormalizedURLFromOwnProps', () => {
  let mockConsoleError;

  beforeEach(() => {
    mockConsoleError = jest.fn();
    console.error = mockConsoleError;
  });

  afterEach(() => {
    console.error = INITIAL_CONSOLE_ERROR;
  });

  test('invalid arguments', () => {
    expect(getNormalizedURLFromOwnProps('fruits', 'eat')).toBe('');
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(getNormalizedURLFromOwnProps('fruits', 'eat', {})).toBe('');
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
  });

  test('empty own props', () => {
    const emptyOwnProps = {
      __requestURLsByActionKey: {},
    };

    expect(getNormalizedURLFromOwnProps('fruits', 'eat', emptyOwnProps)).toBe();
  });

  test('filled own props', () => {
    const filledOwnProps = {
      __requestURLsByActionKey: {
        eat: 'yum',
      },
    };

    expect(getNormalizedURLFromOwnProps('fruits', 'eat', filledOwnProps)).toBe(
      'yum',
    );
  });
});
