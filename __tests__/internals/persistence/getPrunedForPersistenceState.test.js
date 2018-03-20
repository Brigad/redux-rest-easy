import mockdate from 'mockdate';
import moment from 'moment';

import getPrunedForPersistenceState from '../../../src/internals/persistence/getPrunedForPersistenceState';

const URL_1 = 'https://api.co/fruits?page1';
const URL_2 = 'https://api.co/fruits?page2';
const URL_3 = 'https://api.co/fruits?page3';
const URL_4 = 'https://api.co/fruits?page4';
const RESOURCE_NAME = 'fruits';
const RESOURCE_NAME_2 = 'vegetables';

const MOMENT_NOW = moment(Date.UTC(2017, 0, 1));
const EXPIRE_AT_NOW = new Date(Date.UTC(2017, 0, 1)).toISOString();
const EXPIRE_AT_ONE_SEC = new Date(
  Date.UTC(2017, 0, 1) + 1 * 1000,
).toISOString();
const EXPIRE_AT_NEVER = 'never';

const STATE_REQUESTS = {
  requests: {
    [URL_1]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: null,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
    },
    [URL_2]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: true,
      fromCache: false,
    },
    [URL_3]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      expireAt: EXPIRE_AT_ONE_SEC,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
    },
    [URL_4]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
    },
  },
};

const STATE_RESOURCES = {
  requests: {
    [URL_1]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: null,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [1, 2, 3],
      },
    },
    [URL_4]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: false,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [3, 4, 5],
      },
    },
  },
  resources: {
    [RESOURCE_NAME]: {
      1: 'banana',
      2: 'apple',
      3: 'cherry',
      4: 'pineapple',
      5: 'raspberry',
    },
    [RESOURCE_NAME_2]: {
      1: 'carrot',
      2: 'potato',
    },
  },
};

describe('getPrunedForPersistenceState', () => {
  afterEach(() => {
    mockdate.reset();
  });

  test('invalid state', () => {
    expect(Object.keys(getPrunedForPersistenceState()).length).toBe(0);
    expect(Object.keys(getPrunedForPersistenceState(null)).length).toBe(0);
  });

  test('empty state', () => {
    expect(Object.keys(getPrunedForPersistenceState({})).length).toBe(0);
  });

  test('requests: no endedAt', () => {
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_1],
    ).toBeUndefined();
  });

  test('requests: didInvalidate', () => {
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_2],
    ).toBeUndefined();
  });

  test('requests: cache expired', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_3],
    ).not.toBeUndefined();

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_3],
    ).not.toBeUndefined();

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_3],
    ).not.toBeUndefined();

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_3],
    ).toBeUndefined();
  });

  test('requests: expiredAt never', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_4].expireAt,
    ).toBe(EXPIRE_AT_NOW);
  });

  test('resources', () => {
    const prunedState = getPrunedForPersistenceState(STATE_RESOURCES);
    const prunedStateResourcesIds = Object.keys(
      prunedState.resources[RESOURCE_NAME],
    );

    expect(prunedStateResourcesIds.length).toBe(3);

    expect(prunedStateResourcesIds.includes('1')).toBe(false);
    expect(prunedStateResourcesIds.includes('2')).toBe(false);

    expect(prunedStateResourcesIds.includes('3')).toBe(true);
    expect(prunedStateResourcesIds.includes('4')).toBe(true);
    expect(prunedStateResourcesIds.includes('5')).toBe(true);

    expect(prunedState.resources[RESOURCE_NAME_2]).toBeUndefined();
  });
});
