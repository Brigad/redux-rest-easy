import {
  computeNewResolversHashes,
  getEmptyResourceHash,
  getPayloadIdsHash,
  getResourceHash,
  getResourcesHash,
  resetResourceResolversHashes,
} from '../../../src/internals/utils/resolversHashes';

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
const FILLED_STATE = {
  requests: {
    [NORMALIZED_URL]: {
      payloadIds: {
        [RESOURCE_NAME]: PRINCIPAL_RESOURCE_IDS,
      },
    },
  },
  resources: NORMALIZED_PAYLOAD,
};

const EMPTY_STATE_COMPUTED_HASHES = {
  ...EMPTY_STATE,
  resolversHashes: computeNewResolversHashes(
    EMPTY_STATE,
    RESOURCE_NAME,
    NORMALIZED_URL,
    NORMALIZED_PAYLOAD,
    PRINCIPAL_RESOURCE_IDS,
  ),
};
const FILLED_STATE_COMPUTED_HASHES = {
  ...FILLED_STATE,
  resolversHashes: computeNewResolversHashes(
    FILLED_STATE,
    RESOURCE_NAME,
    NORMALIZED_URL,
    NORMALIZED_PAYLOAD,
    PRINCIPAL_RESOURCE_IDS,
  ),
};
const FILLED_STATE_RESET_HASHES = {
  ...FILLED_STATE,
  resolversHashes: resetResourceResolversHashes(FILLED_STATE, RESOURCE_NAME),
};

describe('computeNewResolversHashes', () => {
  test('empty state', () => {
    const hashBeforeComputing = getResourcesHash(EMPTY_STATE);

    const hashAfterComputing = getResourcesHash(
      EMPTY_STATE_COMPUTED_HASHES.resolversHashes,
    );

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
  });

  test('filled state', () => {
    const hashBeforeComputing = getResourcesHash(FILLED_STATE);

    const hashAfterComputing = getResourcesHash(
      FILLED_STATE_COMPUTED_HASHES.resolversHashes,
    );

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
  });
});

describe('resetResourceResolversHashes', () => {
  test('only path', () => {
    const hashBeforeComputing = getResourceHash(
      FILLED_STATE.resolversHashes,
      RESOURCE_NAME,
    );

    const hashAfterComputing = getResourceHash(
      FILLED_STATE_COMPUTED_HASHES.resolversHashes,
      RESOURCE_NAME,
    );

    const hashAfterResetting = getResourceHash(
      FILLED_STATE_RESET_HASHES.resolversHashes,
      RESOURCE_NAME,
    );

    expect(hashBeforeComputing).not.toBe(hashAfterComputing);
    expect(hashBeforeComputing).toBe(hashAfterResetting);
  });
});

describe('getEmptyResourceHash', () => {
  test('only path', () => {
    expect(getEmptyResourceHash()).toMatchSnapshot();
  });
});

describe('getPayloadIdsHash', () => {
  test('no resolversHashes', () => {
    expect(getPayloadIdsHash()).toBe(getEmptyResourceHash());
  });

  test('no resolversHashes.requests', () => {
    expect(getPayloadIdsHash({})).toBe(getEmptyResourceHash());
  });

  test('no normalizedURL', () => {
    expect(getPayloadIdsHash(EMPTY_STATE_COMPUTED_HASHES.resolversHashes)).toBe(
      getEmptyResourceHash(),
    );
  });

  test('no resourceName', () => {
    expect(
      getPayloadIdsHash(
        EMPTY_STATE_COMPUTED_HASHES.resolversHashes,
        NORMALIZED_URL,
      ),
    ).toBe(getEmptyResourceHash());
  });

  test('without computing first', () => {
    expect(
      getPayloadIdsHash(
        FILLED_STATE.resolversHashes,
        NORMALIZED_URL,
        RESOURCE_NAME,
      ),
    ).toBe(getEmptyResourceHash());
  });

  test('after computing', () => {
    expect(
      getPayloadIdsHash(
        FILLED_STATE_COMPUTED_HASHES.resolversHashes,
        NORMALIZED_URL,
        RESOURCE_NAME,
      ),
    ).toMatchSnapshot();
  });
});

describe('getResourcesHash', () => {
  test('no resolversHashes', () => {
    expect(getResourcesHash()).toBe(getEmptyResourceHash());
  });

  test('no resolversHashes.requests', () => {
    expect(getResourcesHash({})).toBe(getEmptyResourceHash());
  });

  test('without computing first', () => {
    expect(getResourcesHash(FILLED_STATE.resolversHashes)).toBe(
      getEmptyResourceHash(),
    );
  });

  test('after computing', () => {
    expect(
      getResourcesHash(FILLED_STATE_COMPUTED_HASHES.resolversHashes),
    ).toMatchSnapshot();
  });
});

describe('getResourceHash', () => {
  test('no resolversHashes', () => {
    expect(getResourceHash()).toBe(getEmptyResourceHash());
  });

  test('no resolversHashes.requests', () => {
    expect(getResourceHash({})).toBe(getEmptyResourceHash());
  });

  test('no resourceName', () => {
    expect(getResourceHash(FILLED_STATE_COMPUTED_HASHES.resolversHashes)).toBe(
      getEmptyResourceHash(),
    );
  });

  test('without computing first', () => {
    expect(getResourceHash(FILLED_STATE.resolversHashes, RESOURCE_NAME)).toBe(
      getEmptyResourceHash(),
    );
  });

  test('after computing', () => {
    expect(
      getResourceHash(
        FILLED_STATE_COMPUTED_HASHES.resolversHashes,
        RESOURCE_NAME,
      ),
    ).toMatchSnapshot();
  });
});
