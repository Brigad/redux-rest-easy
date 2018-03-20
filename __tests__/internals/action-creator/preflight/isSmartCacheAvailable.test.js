import mockdate from 'mockdate';
import moment from 'moment';

import isSmartCacheAvailable from '../../../../src/internals/action-creator/preflight/isSmartCacheAvailable';

const URL = 'https://api.co/fruits';
const OTHER_URL = 'https://api.co/fruits?page1';
const RESOURCE_NAME = 'fruits';
const RESOURCE_ID = 2;

const MOMENT_NOW = moment(Date.UTC(2017, 0, 1));
const EXPIRE_AT_NOW = new Date(Date.UTC(2017, 0, 1)).toISOString();
const EXPIRE_AT_ONE_SEC = new Date(
  Date.UTC(2017, 0, 1) + 1 * 1000,
).toISOString();
const EXPIRE_AT_NEVER = 'never';

const EMPTY_STATE = {};

const HALF_FILLED_STATE = {
  requests: {},
};

const STATE_FILLED_WITH_OTHER_ID = {
  requests: {
    [OTHER_URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: RESOURCE_ID + 1,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [RESOURCE_ID + 1],
      },
    },
  },
};

const SUCCEEDED_STATE_1 = {
  requests: {
    [URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: RESOURCE_ID,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [RESOURCE_ID],
      },
    },
  },
};

const SUCCEEDED_STATE_2 = {
  requests: {
    [URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [RESOURCE_ID],
      },
    },
  },
};

const FAILED_STATE = {
  requests: {
    [URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: RESOURCE_ID,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: false,
      hasFailed: true,
      didInvalidate: false,
      fromCache: false,
    },
  },
};

const INVALIDATED_STATE = {
  requests: {
    [URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: RESOURCE_ID,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: true,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [RESOURCE_ID],
      },
    },
  },
};

const injectExpireAtInState = (state, expireAt) => ({
  requests: {
    [URL]: {
      ...state.requests[URL],
      expireAt,
    },
  },
});

describe('isSmartCacheAvailable', () => {
  afterEach(() => {
    mockdate.reset();
  });

  test('wrong arguments', () => {
    expect(isSmartCacheAvailable()).toBe(false);
    expect(isSmartCacheAvailable(SUCCEEDED_STATE_1)).toBe(false);
    expect(isSmartCacheAvailable(SUCCEEDED_STATE_1, 'GET')).toBe(false);
  });

  test('non cacheable requests', () => {
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NOW),
        'POST',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NOW),
        'PATCH',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NOW),
        'PUT',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NOW),
        'DELETE',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('state empty of resource/id', () => {
    mockdate.set(MOMENT_NOW);

    expect(
      isSmartCacheAvailable(EMPTY_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 0),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(HALF_FILLED_STATE, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(STATE_FILLED_WITH_OTHER_ID, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('succeeded state 1, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('succeeded state 2, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('failed state, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('invalidated state, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(INVALIDATED_STATE, EXPIRE_AT_NOW),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('succeeded state 1, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('succeeded state 2, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('failed state, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('invalidated state, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(INVALIDATED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('succeeded state 1, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_1, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);
  });

  test('succeeded state 2, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(SUCCEEDED_STATE_2, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(true);
  });

  test('failed state, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });

  test('invalidated state, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isSmartCacheAvailable(
        injectExpireAtInState(INVALIDATED_STATE, EXPIRE_AT_NEVER),
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
      ),
    ).toBe(false);
  });
});
