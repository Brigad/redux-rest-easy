import mockdate from 'mockdate';
import moment from 'moment';

import getReducerCases from '../../../../src/internals/reducer/generateReducer/getReducerCases';

const CACHE_LIFETIME = 0;
const RESOURCE_NAME = 'fruits';
const RESOURCE_ID = 2;
const ACTION_NAME = 'eat';
const NORMALIZED_URL = 'eat:https://api.co/fruits';
const MOCK_DATE = moment
  .utc()
  .year(2017)
  .month(0)
  .date(1)
  .startOf('day');

const INITIAL_STATE_EMPTY = {};
const INITIAL_STATE_FULL = {
  requests: {
    [NORMALIZED_URL]: {
      resourceName: RESOURCE_NAME,
      didInvalidate: true,
    },
    someURL: {
      resourceName: RESOURCE_NAME,
      resourceId: RESOURCE_ID,
      didInvalidate: false,
    },
    someOtherURL: {
      didInvalidate: false,
      payloadIds: {
        [RESOURCE_NAME]: [1],
      },
    },
    anotherURL: {
      didInvalidate: false,
      payloadIds: {
        [RESOURCE_NAME]: [1, RESOURCE_ID, 3],
        vegetables: [RESOURCE_ID],
      },
    },
    yetAnotherURL: {
      didInvalidate: false,
      payloadIds: {
        vegetables: [1],
        seeds: [RESOURCE_ID],
      },
    },
  },
  resources: {
    [RESOURCE_NAME]: {
      1: 'banana',
      [RESOURCE_ID]: 'cherry',
      3: 'apple',
    },
    vegetables: {
      1: 'potato',
      [RESOURCE_ID]: 'leek',
    },
    seeds: {
      [RESOURCE_ID]: 'pumpkin',
    },
  },
};

const REDUCER_CASES = getReducerCases();

describe('getReducerCases', () => {
  afterEach(() => {
    mockdate.reset();
  });

  test('reducer cases keys', () => {
    expect(REDUCER_CASES).toMatchSnapshot();
  });

  describe('REQUEST', () => {
    test('empty state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/REQUEST`,
        url: NORMALIZED_URL,
        resourceId: 2,
      };

      expect(
        REDUCER_CASES.REQUEST(INITIAL_STATE_EMPTY, action),
      ).toMatchSnapshot();
    });

    test('full state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/REQUEST`,
        url: NORMALIZED_URL,
        resourceId: 2,
      };

      expect(
        REDUCER_CASES.REQUEST(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });
  });

  describe('RECEIVE', () => {
    test('empty state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/RECEIVE`,
        url: NORMALIZED_URL,
        payload: {
          fruits: {
            1: 'banana',
            2: 'cherry',
            3: 'apple',
          },
          animals: {
            1: 'worm',
          },
        },
        principalResourceIds: ['2', '1', '3'],
      };

      expect(
        REDUCER_CASES.RECEIVE(INITIAL_STATE_EMPTY, action),
      ).toMatchSnapshot();
    });

    test('full state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/RECEIVE`,
        url: NORMALIZED_URL,
        payload: {
          fruits: {
            1: 'banana',
            2: 'cherry',
            3: 'apple',
          },
          animals: {
            1: 'worm',
          },
        },
        principalResourceIds: ['2', '1', '3'],
        cacheLifetime: CACHE_LIFETIME,
      };

      expect(
        REDUCER_CASES.RECEIVE(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });

    test('full state cacheLifetime = Infinity', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/RECEIVE`,
        url: NORMALIZED_URL,
        payload: {
          fruits: {
            1: 'banana',
            2: 'cherry',
            3: 'apple',
          },
          animals: {
            1: 'worm',
          },
        },
        principalResourceIds: ['2', '1', '3'],
        cacheLifetime: Infinity,
      };

      expect(
        REDUCER_CASES.RECEIVE(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });
  });

  describe('FAIL', () => {
    test('empty state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        url: NORMALIZED_URL,
      };

      expect(REDUCER_CASES.FAIL(INITIAL_STATE_EMPTY, action)).toMatchSnapshot();
    });

    test('full state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        url: NORMALIZED_URL,
      };

      expect(REDUCER_CASES.FAIL(INITIAL_STATE_FULL, action)).toMatchSnapshot();
    });
  });

  describe('RECEIVE_FROM_CACHE', () => {
    test('empty state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/RECEIVE_FROM_CACHE`,
        url: NORMALIZED_URL,
        resourceId: 2,
        payload: {
          fruits: {
            2: null,
          },
        },
        principalResourceIds: ['2'],
      };

      expect(
        REDUCER_CASES.RECEIVE_FROM_CACHE(INITIAL_STATE_EMPTY, action),
      ).toMatchSnapshot();
    });

    test('full state', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/RECEIVE_FROM_CACHE`,
        url: NORMALIZED_URL,
        resourceId: 2,
        payload: {
          fruits: {
            2: null,
          },
        },
        principalResourceIds: ['2'],
        cacheLifetime: CACHE_LIFETIME,
      };

      expect(
        REDUCER_CASES.RECEIVE_FROM_CACHE(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });

    test('full state cacheLifetime = Infinity', () => {
      mockdate.set(MOCK_DATE);

      const action = {
        type: `@@rest-easy/${RESOURCE_NAME}/${ACTION_NAME}/RECEIVE_FROM_CACHE`,
        url: NORMALIZED_URL,
        resourceId: 2,
        payload: {
          fruits: {
            2: null,
          },
        },
        principalResourceIds: ['2'],
        cacheLifetime: Infinity,
      };

      expect(
        REDUCER_CASES.RECEIVE_FROM_CACHE(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });
  });

  describe('INVALIDATE_RESOURCE', () => {
    test('empty state', () => {
      const action = {
        resourceName: RESOURCE_NAME,
      };

      const result = REDUCER_CASES.INVALIDATE_RESOURCE(
        INITIAL_STATE_EMPTY,
        action,
      );

      expect(result).toMatchSnapshot();
    });

    test('full state', () => {
      const action = {
        resourceName: RESOURCE_NAME,
      };

      const result = REDUCER_CASES.INVALIDATE_RESOURCE(
        INITIAL_STATE_FULL,
        action,
      );

      expect(result).toMatchSnapshot();
      expect(result.requests.anotherURL).not.toBe(
        INITIAL_STATE_FULL.requests.anotherURL,
      );
      expect(result.requests.yetAnotherURL).toBe(
        INITIAL_STATE_FULL.requests.yetAnotherURL,
      );
    });
  });

  describe('INVALIDATE_ID', () => {
    test('empty state', () => {
      const action = {
        resourceName: RESOURCE_NAME,
        resourceId: RESOURCE_ID,
      };

      const result = REDUCER_CASES.INVALIDATE_ID(INITIAL_STATE_EMPTY, action);

      expect(result).toMatchSnapshot();
    });

    test('full state', () => {
      const action = {
        resourceName: RESOURCE_NAME,
        resourceId: 3,
      };

      const result = REDUCER_CASES.INVALIDATE_ID(INITIAL_STATE_FULL, action);

      expect(result).toMatchSnapshot();
      expect(result.requests.anotherURL).not.toBe(
        INITIAL_STATE_FULL.requests.anotherURL,
      );
      expect(result.requests.yetAnotherURL).toBe(
        INITIAL_STATE_FULL.requests.yetAnotherURL,
      );
    });
  });

  describe('INVALIDATE_REQUEST', () => {
    test('empty state', () => {
      const action = {
        url: NORMALIZED_URL,
      };

      const result = REDUCER_CASES.INVALIDATE_REQUEST(
        INITIAL_STATE_EMPTY,
        action,
      );

      expect(result).toMatchSnapshot();
    });

    test('full state', () => {
      const action = {
        url: NORMALIZED_URL,
      };

      const result = REDUCER_CASES.INVALIDATE_REQUEST(
        INITIAL_STATE_FULL,
        action,
      );

      expect(result).toMatchSnapshot();
      expect(result.requests[NORMALIZED_URL]).not.toBe(
        INITIAL_STATE_FULL.requests[NORMALIZED_URL],
      );
      expect(result.requests.anotherURL).toBe(
        INITIAL_STATE_FULL.requests.anotherURL,
      );
    });
  });

  describe('RESET_RESOURCE', () => {
    test('empty state', () => {
      const action = {
        resourceName: RESOURCE_NAME,
      };

      expect(
        REDUCER_CASES.RESET_RESOURCE(INITIAL_STATE_EMPTY, action),
      ).toMatchSnapshot();
    });

    test('full state', () => {
      const action = {
        resourceName: RESOURCE_NAME,
      };

      expect(
        REDUCER_CASES.RESET_RESOURCE(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });
  });

  describe('RESET_ALL', () => {
    test('empty state', () => {
      const action = {};

      expect(
        REDUCER_CASES.RESET_ALL(INITIAL_STATE_EMPTY, action),
      ).toMatchSnapshot();
    });

    test('full state', () => {
      const action = {};

      expect(
        REDUCER_CASES.RESET_ALL(INITIAL_STATE_FULL, action),
      ).toMatchSnapshot();
    });
  });
});
