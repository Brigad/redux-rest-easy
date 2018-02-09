import mockdate from 'mockdate';
import moment from 'moment';

import isSmartCacheAvailable from '../../../../src/internals/action-creator/preflight/isSmartCacheAvailable';

const URL = 'https://api.co/fruits';
const OTHER_URL = 'https://api.co/fruits?page1';

const RESOURCE_NAME = 'fruits';
const RESOURCE_ID = 2;
const END_DATE = moment(Date.UTC(2017, 0, 1));

const EMPTY_STATE = {};

const HALF_FILLED_STATE = {
  requests: {},
};

const STATE_FILLED_WITH_OTHER_ID = {
  requests: {
    [OTHER_URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: RESOURCE_ID + 1,
      startedAt: END_DATE,
      endedAt: END_DATE,
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
      startedAt: END_DATE,
      endedAt: END_DATE,
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
      startedAt: END_DATE,
      endedAt: END_DATE,
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
      startedAt: END_DATE,
      endedAt: END_DATE,
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
      startedAt: END_DATE,
      endedAt: END_DATE,
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

describe('isCacheExpired', () => {
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
        SUCCEEDED_STATE_1,
        'POST',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'PATCH',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'PUT',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'DELETE',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
  });

  test('state empty of resource/id', () => {
    mockdate.set(END_DATE);

    expect(
      isSmartCacheAvailable(EMPTY_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 0),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        HALF_FILLED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
    expect(
      isSmartCacheAvailable(
        STATE_FILLED_WITH_OTHER_ID,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
  });

  test('succeeded state 1, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
  });

  test('succeeded state 2, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
  });

  test('failed state, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 0),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 0),
    ).toBe(false);
  });

  test('invalidated state, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        INVALIDATED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        0,
      ),
    ).toBe(false);
  });

  test('succeeded state 1, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(false);
  });

  test('succeeded state 2, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(false);
  });

  test('failed state, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 1),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 1),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 1),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 1),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(FAILED_STATE, 'GET', RESOURCE_NAME, RESOURCE_ID, 1),
    ).toBe(false);
  });

  test('invalidated state, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        INVALIDATED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        1,
      ),
    ).toBe(false);
  });

  test('succeeded state 1, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_1,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);
  });

  test('succeeded state 2, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        SUCCEEDED_STATE_2,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(true);
  });

  test('failed state, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        FAILED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        FAILED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        FAILED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        FAILED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(false);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(
      isSmartCacheAvailable(
        FAILED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(false);
  });

  test('invalidated state, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(
      isSmartCacheAvailable(
        INVALIDATED_STATE,
        'GET',
        RESOURCE_NAME,
        RESOURCE_ID,
        Infinity,
      ),
    ).toBe(false);
  });
});
