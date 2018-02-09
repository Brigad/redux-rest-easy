import mockdate from 'mockdate';
import moment from 'moment';

import isCacheExpired from '../../../../src/internals/action-creator/preflight/isCacheExpired';

const URL = 'https://api.co/fruits';
const OTHER_URL = 'https://api.co/fruits?page1';

const RESOURCE_NAME = 'fruits';
const END_DATE = moment
  .utc()
  .year(2017)
  .month(0)
  .date(1)
  .startOf('day');

const EMPTY_STATE = {};

const HALF_FILLED_STATE = {
  requests: {},
};

const STATE_FILLED_WITH_OTHER_REQUEST = {
  requests: {
    [OTHER_URL]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: END_DATE,
      endedAt: END_DATE,
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
      startedAt: END_DATE,
      endedAt: END_DATE,
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
      resourceId: null,
      startedAt: END_DATE,
      endedAt: END_DATE,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: true,
      fromCache: false,
    },
  },
};

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
    expect(isCacheExpired(SUCCEEDED_STATE, 'POST', URL, 0)).toBe(true);
    expect(isCacheExpired(SUCCEEDED_STATE, 'PATCH', URL, 0)).toBe(true);
    expect(isCacheExpired(SUCCEEDED_STATE, 'PUT', URL, 0)).toBe(true);
    expect(isCacheExpired(SUCCEEDED_STATE, 'DELETE', URL, 0)).toBe(true);
  });

  test('state empty of concerned url', () => {
    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));

    expect(isCacheExpired(EMPTY_STATE, 'GET', URL, 0)).toBe(true);
    expect(isCacheExpired(HALF_FILLED_STATE, 'GET', URL, 0)).toBe(true);
    expect(isCacheExpired(STATE_FILLED_WITH_OTHER_REQUEST, 'GET', URL, 0)).toBe(
      true,
    );
  });

  test('succeeded state, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 0)).toBe(false);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 0)).toBe(true);
  });

  test('failed state, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 0)).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 0)).toBe(true);
  });

  test('invalidated state, cacheLifetime = 0', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(INVALIDATED_STATE, 'GET', URL, 0)).toBe(true);
  });

  test('succeeded state, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 1)).toBe(false);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 1)).toBe(false);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 1)).toBe(false);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 1)).toBe(false);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, 1)).toBe(true);
  });

  test('failed state, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 1)).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 1)).toBe(true);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 1)).toBe(true);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 1)).toBe(true);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, 1)).toBe(true);
  });

  test('invalidated state, cacheLifetime = 1', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(INVALIDATED_STATE, 'GET', URL, 1)).toBe(true);
  });

  test('succeeded state, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, Infinity)).toBe(false);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, Infinity)).toBe(false);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, Infinity)).toBe(false);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, Infinity)).toBe(false);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(isCacheExpired(SUCCEEDED_STATE, 'GET', URL, Infinity)).toBe(false);
  });

  test('failed state, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, Infinity)).toBe(true);

    mockdate.set(moment(END_DATE).add(1, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, Infinity)).toBe(true);

    mockdate.set(moment(END_DATE).add(999, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, Infinity)).toBe(true);

    mockdate.set(moment(END_DATE).add(1000, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, Infinity)).toBe(true);

    mockdate.set(moment(END_DATE).add(1001, 'milliseconds'));
    expect(isCacheExpired(FAILED_STATE, 'GET', URL, Infinity)).toBe(true);
  });

  test('invalidated state, cacheLifetime = Infinity', () => {
    mockdate.set(END_DATE);
    expect(isCacheExpired(INVALIDATED_STATE, 'GET', URL, Infinity)).toBe(true);
  });
});
