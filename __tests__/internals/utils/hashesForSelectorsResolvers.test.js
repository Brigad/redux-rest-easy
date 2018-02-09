import {
  computeHashesForSelectorsResolvers,
  getEmptyResourceHash,
  getPayloadIdsHash,
  getResourceHash,
  getResourcesHash,
  resetAllResourcesHashForSelectorsResolvers,
  resetResourceHashForSelectorsResolvers,
} from '../../../src/internals/utils/hashesForSelectorsResolvers';

const RESOURCE_NAME = 'fruits';
const NORMALIZED_URL = 'eat:https://api.co/fruits';
const PRINCIPAL_RESOURCE_IDS = ['2', '3', '1'];
const NORMALIZED_PAYLOAD = {
  [RESOURCE_NAME]: {
    1: {
      type: 'apple',
      juicy: true,
    },
    2: {
      type: 'banana',
      juicy: false,
    },
    3: {
      type: 'cherry',
      juicy: false,
    },
  },
};
const EMPTY_STATE = {};
const STATE = {
  requests: {
    [NORMALIZED_URL]: {
      payloadIds: {
        [RESOURCE_NAME]: PRINCIPAL_RESOURCE_IDS,
      },
    },
  },
  resources: NORMALIZED_PAYLOAD,
};

const computeHashesEmptyState = () => {
  computeHashesForSelectorsResolvers(
    EMPTY_STATE,
    RESOURCE_NAME,
    NORMALIZED_URL,
    NORMALIZED_PAYLOAD,
    PRINCIPAL_RESOURCE_IDS,
  );
};

const computeHashes = () => {
  computeHashesForSelectorsResolvers(
    STATE,
    RESOURCE_NAME,
    NORMALIZED_URL,
    NORMALIZED_PAYLOAD,
    PRINCIPAL_RESOURCE_IDS,
  );
};

describe('computeHashesForSelectorsResolvers', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('empty state', () => {
    const hashBeforeComputing = getResourcesHash();

    computeHashesEmptyState();

    const hashAfterComputing = getResourcesHash();

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
  });

  test('filled state', () => {
    const hashBeforeComputing = getResourcesHash();

    computeHashes();

    const hashAfterComputing = getResourcesHash();

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
  });
});

describe('resetResourceHashForSelectorsResolvers', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('only path', () => {
    const hashBeforeComputing = getResourceHash(RESOURCE_NAME);

    computeHashes();

    const hashAfterComputing = getResourceHash(RESOURCE_NAME);

    resetResourceHashForSelectorsResolvers(STATE, RESOURCE_NAME);

    const hashAfterResetting = getResourceHash(RESOURCE_NAME);

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
    expect(hashBeforeComputing).toBe(hashAfterResetting);
  });
});

describe('resetAllResourcesHashForSelectorsResolvers', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('only path', () => {
    const hashBeforeComputing = getResourceHash(RESOURCE_NAME);

    computeHashes();

    const hashAfterComputing = getResourceHash(RESOURCE_NAME);

    resetAllResourcesHashForSelectorsResolvers();

    const hashAfterResetting = getResourceHash(RESOURCE_NAME);

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
    expect(hashBeforeComputing).toBe(hashAfterResetting);
  });
});

describe('getEmptyResourceHash', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('without computing first', () => {
    expect(getEmptyResourceHash()).toMatchSnapshot();
  });

  test('after computing', () => {
    computeHashes();

    expect(getEmptyResourceHash()).toMatchSnapshot();
  });
});

describe('getPayloadIdsHash', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('no normalizedURL', () => {
    expect(getPayloadIdsHash()).toMatchSnapshot();
  });

  test('no resourceName', () => {
    expect(getPayloadIdsHash(NORMALIZED_URL)).toMatchSnapshot();
  });

  test('without computing first', () => {
    expect(getPayloadIdsHash(NORMALIZED_URL, RESOURCE_NAME)).toMatchSnapshot();
  });

  test('after computing', () => {
    computeHashes();

    expect(getPayloadIdsHash(NORMALIZED_URL, RESOURCE_NAME)).toMatchSnapshot();
  });
});

describe('getResourcesHash', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('without computing first', () => {
    expect(getResourcesHash()).toMatchSnapshot();
  });

  test('after computing', () => {
    computeHashes();

    expect(getResourcesHash()).toMatchSnapshot();
  });
});

describe('getResourceHash', () => {
  afterEach(resetAllResourcesHashForSelectorsResolvers);

  test('no resourceName', () => {
    expect(getResourceHash()).toMatchSnapshot();
  });

  test('without computing first', () => {
    expect(getResourceHash(RESOURCE_NAME)).toMatchSnapshot();
  });

  test('after computing', () => {
    computeHashes();

    expect(getResourceHash(RESOURCE_NAME)).toMatchSnapshot();
  });
});
