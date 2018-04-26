import mockdate from 'mockdate';
import moment from 'moment';

import getPrunedForPersistenceState from '../../../src/internals/persistence/getPrunedForPersistenceState';

const URL_PENDING = 'https://api.co/fruits?page1';
const URL_INVALIDATED = 'https://api.co/fruits?page2';
const URL_SOON_TO_EXPIRE = 'https://api.co/fruits?page3';
const URL_NEVER_EXPIRE = 'https://api.co/fruits?page4';
const RESOURCE_NAME = 'fruits';
const RESOURCE_NAME_2 = 'vegetables';
const RESOURCE_NAME_3 = 'sauces';

const MOMENT_NOW = moment(Date.UTC(2017, 0, 1));
const EXPIRE_AT_ONE_SEC = new Date(
  Date.UTC(2017, 0, 1) + 1 * 1000,
).toISOString();
const EXPIRE_AT_NEVER = 'never';

const STATE_REQUESTS = {
  requests: {
    [URL_PENDING]: {
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
    [URL_INVALIDATED]: {
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
    [URL_SOON_TO_EXPIRE]: {
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
    [URL_NEVER_EXPIRE]: {
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
    [URL_PENDING]: {
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
    [URL_INVALIDATED]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: true,
      fromCache: false,
      payloadIds: {
        [RESOURCE_NAME]: [1, 2, 3],
      },
    },
    [URL_NEVER_EXPIRE]: {
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
    [URL_NEVER_EXPIRE]: {
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
    [URL_PENDING]: {
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
    [URL_INVALIDATED]: {
      resourceName: RESOURCE_NAME,
      resourceId: null,
      startedAt: MOMENT_NOW,
      endedAt: MOMENT_NOW,
      expireAt: EXPIRE_AT_NEVER,
      hasSucceeded: true,
      hasFailed: false,
      didInvalidate: true,
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
    [URL_PENDING]: {
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
    [URL_NEVER_EXPIRE]: {
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
      [URL_PENDING]: {
        [RESOURCE_NAME]: 'URL_PENDING_HASH',
      },
      [URL_NEVER_EXPIRE]: {
        [RESOURCE_NAME]: 'URL_NEVER_EXPIRE_HASH',
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

  test('half empty state', () => {
    const prunedState1 = getPrunedForPersistenceState({ requests: {} });
    expect(Object.keys(prunedState1).length).toBe(3);
    expect(Object.keys(prunedState1.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resources).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.resources).length).toBe(0);

    const prunedState2 = getPrunedForPersistenceState({ resources: {} });
    expect(Object.keys(prunedState2).length).toBe(3);
    expect(Object.keys(prunedState2.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resources).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.resources).length).toBe(0);

    const prunedState3 = getPrunedForPersistenceState({ resolversHashes: {} });
    expect(Object.keys(prunedState3).length).toBe(3);
    expect(Object.keys(prunedState3.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resources).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.resources).length).toBe(0);
  });

  test('half empty state 2', () => {
    const prunedState1 = getPrunedForPersistenceState({
      requests: {},
      resources: {},
    });
    expect(Object.keys(prunedState1).length).toBe(3);
    expect(Object.keys(prunedState1.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resources).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.resources).length).toBe(0);

    const prunedState2 = getPrunedForPersistenceState({
      requests: {},
      resolversHashes: {},
    });
    expect(Object.keys(prunedState2).length).toBe(3);
    expect(Object.keys(prunedState2.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resources).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.resources).length).toBe(0);

    const prunedState3 = getPrunedForPersistenceState({
      resources: {},
      resolversHashes: {},
    });
    expect(Object.keys(prunedState3).length).toBe(3);
    expect(Object.keys(prunedState3.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resources).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.resources).length).toBe(0);
  });

  test('half empty state deep', () => {
    const prunedState1 = getPrunedForPersistenceState({
      requests: { [URL_PENDING]: null },
    });
    expect(Object.keys(prunedState1).length).toBe(3);
    expect(Object.keys(prunedState1.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resources).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.resources).length).toBe(0);

    const prunedState2 = getPrunedForPersistenceState({
      resources: { [RESOURCE_NAME]: null },
    });
    expect(Object.keys(prunedState2).length).toBe(3);
    expect(Object.keys(prunedState2.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resources).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.resources).length).toBe(0);

    const prunedState3 = getPrunedForPersistenceState({
      resolversHashes: {
        requests: { [URL_PENDING]: null },
        resources: { [RESOURCE_NAME]: null },
      },
    });
    expect(Object.keys(prunedState3).length).toBe(3);
    expect(Object.keys(prunedState3.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resources).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.resources).length).toBe(0);
  });

  test('half empty state deep 2', () => {
    const prunedState1 = getPrunedForPersistenceState({
      requests: { [URL_PENDING]: null },
      resources: { [RESOURCE_NAME]: null },
    });
    expect(Object.keys(prunedState1).length).toBe(3);
    expect(Object.keys(prunedState1.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resources).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState1.resolversHashes.resources).length).toBe(0);

    const prunedState2 = getPrunedForPersistenceState({
      requests: { [URL_PENDING]: null },
      resolversHashes: {
        requests: { [URL_PENDING]: null },
        resources: { [RESOURCE_NAME]: null },
      },
    });
    expect(Object.keys(prunedState2).length).toBe(3);
    expect(Object.keys(prunedState2.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resources).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState2.resolversHashes.resources).length).toBe(0);

    const prunedState3 = getPrunedForPersistenceState({
      resources: { [RESOURCE_NAME]: null },
      resolversHashes: {
        requests: { [URL_PENDING]: null },
        resources: { [RESOURCE_NAME]: null },
      },
    });
    expect(Object.keys(prunedState3).length).toBe(3);
    expect(Object.keys(prunedState3.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resources).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.requests).length).toBe(0);
    expect(Object.keys(prunedState3.resolversHashes.resources).length).toBe(0);
  });

  test('requests: no endedAt', () => {
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_PENDING],
    ).toBeUndefined();
  });

  test('requests: didInvalidate', () => {
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_INVALIDATED],
    ).toBeUndefined();
  });

  test('requests: cache expired', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_SOON_TO_EXPIRE],
    ).not.toBeUndefined();

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_SOON_TO_EXPIRE],
    ).not.toBeUndefined();

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_SOON_TO_EXPIRE],
    ).not.toBeUndefined();

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_SOON_TO_EXPIRE],
    ).toBeUndefined();
  });

  test('requests: expiredAt never', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      getPrunedForPersistenceState(STATE_REQUESTS).requests[URL_NEVER_EXPIRE]
        .didInvalidate,
    ).toBe(true);
  });

  test('requests: always persist string', () => {
    expect(
      getPrunedForPersistenceState(STATE_RESOURCES, {
        alwaysPersist: RESOURCE_NAME,
      }).requests[URL_INVALIDATED],
    ).not.toBeUndefined();
  });

  test('requests: always persist array', () => {
    expect(
      getPrunedForPersistenceState(STATE_RESOURCES, {
        alwaysPersist: [RESOURCE_NAME],
      }).requests[URL_INVALIDATED],
    ).not.toBeUndefined();
  });

  test('requests: always persist no endedAt string', () => {
    expect(
      getPrunedForPersistenceState(STATE_RESOURCES, {
        alwaysPersist: RESOURCE_NAME,
      }).requests[URL_PENDING],
    ).toBeUndefined();
  });

  test('requests: always persist no endedAt array', () => {
    expect(
      getPrunedForPersistenceState(STATE_RESOURCES, {
        alwaysPersist: [RESOURCE_NAME],
      }).requests[URL_PENDING],
    ).toBeUndefined();
  });

  test('requests: never persist string', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      getPrunedForPersistenceState(STATE_RESOURCES, {
        neverPersist: RESOURCE_NAME,
      }).requests[URL_NEVER_EXPIRE],
    ).toBeUndefined();
  });

  test('requests: never persist array', () => {
    mockdate.set(MOMENT_NOW);
    expect(
      getPrunedForPersistenceState(STATE_RESOURCES, {
        neverPersist: [RESOURCE_NAME],
      }).requests[URL_NEVER_EXPIRE],
    ).toBeUndefined();
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

    expect(prunedStateResolversHashes.requests[URL_PENDING]).toBeUndefined();
    expect(
      prunedStateResolversHashes.requests[URL_NEVER_EXPIRE][RESOURCE_NAME],
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
