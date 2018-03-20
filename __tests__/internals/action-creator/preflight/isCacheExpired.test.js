import mockdate from 'mockdate';
import moment from 'moment';

import isCacheExpired from '../../../../src/internals/action-creator/preflight/isCacheExpired';

const URL = 'https://api.co/fruits';
const OTHER_URL = 'https://api.co/fruits?page1';
const RESOURCE_NAME = 'fruits';

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

const STATE_FILLED_WITH_OTHER_REQUEST = {
  requests: {
    [OTHER_URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
    },
  },
};

const SUCCEEDED_STATE = {
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
    },
  },
};

const FAILED_STATE = {
  requests: {
    [URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
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
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: true,
      fromCache: false,
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

describe('isCacheExpired', () => {
  afterEach(() => {
    mockdate.reset();
  });

  test('wrong arguments', () => {
    expect(isCacheExpired()).toBe(true);
    expect(isCacheExpired(SUCCEEDED_STATE)).toBe(true);
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET')).toBe(true);
  });

  test('non cacheable requests', () => {
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NOW),
        'POST',
        URL,
      ),
    ).toBe(true);
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NOW),
        'PATCH',
        URL,
      ),
    ).toBe(true);
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NOW),
        'PUT',
        URL,
      ),
    ).toBe(true);
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NOW),
        'DELETE',
        URL,
      ),
    ).toBe(true);
  });

  test('state empty of concerned url', () => {
    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));

    expect(isCacheExpired(EMPTY_STATE, 'GET', URL)).toBe(true);
    expect(
      isCacheExpired(
        injectExpireAtInState(HALF_FILLED_STATE, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(true);
    expect(
      isCacheExpired(
        injectExpireAtInState(STATE_FILLED_WITH_OTHER_REQUEST, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('succeeded state, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('failed state, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('invalidated state, cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(INVALIDATED_STATE, EXPIRE_AT_NOW),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('succeeded state, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('failed state, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('invalidated state, cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(INVALIDATED_STATE, EXPIRE_AT_ONE_SEC),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('succeeded state, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(SUCCEEDED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(false);
  });

  test('failed state, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(true);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      isCacheExpired(
        injectExpireAtInState(FAILED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(true);
  });

  test('invalidated state, cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      isCacheExpired(
        injectExpireAtInState(INVALIDATED_STATE, EXPIRE_AT_NEVER),
        'GET',
        URL,
      ),
    ).toBe(true);
  });
});
