import mockdate from 'mockdate';
import moment from 'moment';

import getPrunedForPersistenceState from '../../../src/internals/persistence/getPrunedForPersistenceState';

const URL_1 = 'https://api.co/fruits?page1';
const URL_2 = 'https://api.co/fruits?page2';
const URL_3 = 'https://api.co/fruits?page3';
const URL_4 = 'https://api.co/fruits?page4';
const RESOURCE_NAME = 'fruits';
const RESOURCE_NAME_2 = 'vegetables';
const RESOURCE_NAME_3 = 'sauces';

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

const STATE_RESOURCES_OTHER_ORDER = {
  requests: {
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
  },
  resources: {
    [RESOURCE_NAME_2]: {
      1: 'carrot',
      2: 'potato',
    },
    [RESOURCE_NAME]: {
      1: 'banana',
      2: 'apple',
      3: 'cherry',
      4: 'pineapple',
      5: 'raspberry',
    },
  },
};

const STATE_RESOLVERS_HASHES = {
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
        [RESOURCE_NAME_3]: [1, 2],
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
    [RESOURCE_NAME_3]: {
      1: 'chocolate',
      2: 'fudge',
    },
  },
  resolversHashes: {
    requests: {
      [URL_1]: {
        [RESOURCE_NAME]: 'URL_1_HASH',
      },
      [URL_4]: {
        [RESOURCE_NAME]: 'URL_4_HASH',
      },
    },
    resources: {
      [RESOURCE_NAME]: 'RESOURCE_HASH',
      [RESOURCE_NAME_2]: 'RESOURCE_2_HASH',
      [RESOURCE_NAME_3]: 'RESOURCE_3_HASH',
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

  test('resources first order', () => {
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

  test('resources second order', () => {
    const prunedState = getPrunedForPersistenceState(
      STATE_RESOURCES_OTHER_ORDER,
    );
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

  test('resolversHashes', () => {
    const prunedStateResolversHashes = getPrunedForPersistenceState(
      STATE_RESOLVERS_HASHES,
    ).resolversHashes;

    console.log(STATE_RESOLVERS_HASHES);
    console.log(getPrunedForPersistenceState(STATE_RESOLVERS_HASHES));

    expect(prunedStateResolversHashes.requests[URL_1]).toBeUndefined();
    expect(
      prunedStateResolversHashes.requests[URL_4][RESOURCE_NAME],
    ).not.toBeUndefined();
    expect(prunedStateResolversHashes.resources[RESOURCE_NAME]).toBeUndefined();
    expect(
      prunedStateResolversHashes.resources[RESOURCE_NAME_2],
    ).toBeUndefined();
    expect(
      prunedStateResolversHashes.resources[RESOURCE_NAME_3],
    ).not.toBeUndefined();
  });
});
