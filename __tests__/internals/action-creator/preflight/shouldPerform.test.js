import moment from 'moment';

import shouldPerform from '../../../../src/internals/action-creator/preflight/shouldPerform';

const URL = 'https://api.co/fruits';
const OTHER_URL = 'https://api.co/fruits?page1';

const END_DATE = moment(Date.UTC(2017, 0, 1));

const EMPTY_STATE = {};

const HALF_FILLED_STATE = {
  requests: {},
};

const STATE_FILLED_WITH_OTHER_REQUEST = {
  requests: {
    [OTHER_URL]: {
      resourceName: 'fruits',
      resourceId: null,
      startedAt: END_DATE,
      endedAt: END_DATE,
      hasSucceeded: true,
      hasFailed: false,
    },
  },
};

const REQUESTED_STATE = {
  requests: {
    [URL]: {
      resourceName: 'fruits',
      resourceId: null,
      startedAt: END_DATE,
      endedAt: null,
      hasSucceeded: false,
      hasFailed: false,
    },
  },
};

const RECEIVED_STATE = {
  requests: {
    [URL]: {
      resourceName: 'fruits',
      resourceId: null,
      startedAt: END_DATE,
      endedAt: END_DATE,
      hasSucceeded: true,
      hasFailed: false,
    },
  },
};

describe('shouldPerform', () => {
  test('wrong arguments', () => {
    expect(shouldPerform()).toBe(true);
    expect(shouldPerform(REQUESTED_STATE)).toBe(true);
  });

  test('state empty of concerned url', () => {
    expect(shouldPerform(EMPTY_STATE, URL)).toBe(true);
    expect(shouldPerform(HALF_FILLED_STATE, URL)).toBe(true);
    expect(shouldPerform(STATE_FILLED_WITH_OTHER_REQUEST, URL)).toBe(true);
  });

  test('requested state', () => {
    expect(shouldPerform(REQUESTED_STATE, URL)).toBe(false);
  });

  test('received state', () => {
    expect(shouldPerform(RECEIVED_STATE, URL)).toBe(true);
  });
});
