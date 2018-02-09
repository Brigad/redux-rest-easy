import moment from 'moment';

import generateResourceSelectors from '../../../src/internals/selectors/generateResourceSelectors';

const {
  resource: { getResource, getResourceById },
} = generateResourceSelectors('fruits');

const STARTED_AT = moment();
const ENDED_AT = moment().add(1, 'seconds');

const EMPTY_STATE = {
  restEasy: {},
};

const REQUESTED_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: null,
        hasSucceeded: false,
        hasFailed: false,
      },
    },
  },
};

const RECEIVED_EMPTY_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {},
      },
    },
    resources: {},
  },
};

const RECEIVED_FULL_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {
          fruits: [1, 2, 3],
        },
      },
    },
    resources: {
      fruits: {
        1: 'banana',
        2: 'cherry',
        3: 'apple',
      },
    },
  },
};

const FAILED_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: false,
        hasFailed: true,
      },
    },
  },
};

const REQUESTED_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits': {
        resourceName: 'fruits',
        resourceId: '2',
        startedAt: STARTED_AT,
        endedAt: null,
        hasSucceeded: false,
        hasFailed: false,
      },
    },
  },
};

const RECEIVED_EMPTY_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits/2': {
        resourceName: 'fruits',
        resourceId: '2',
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {},
      },
    },
    resources: {},
  },
};

const RECEIVED_FULL_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits/2': {
        resourceName: 'fruits',
        resourceId: 2,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {
          fruits: [2],
        },
      },
    },
    resources: {
      fruits: {
        2: 'cherry',
      },
    },
  },
};

const FAILED_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits/2': {
        resourceName: 'fruits',
        resourceId: 2,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: false,
        hasFailed: true,
      },
    },
  },
};

describe('generateResourceSelectors', () => {
  describe('getResource', () => {
    const emptyCase = state => () => {
      const result = getResource(state);

      expect(result.length).toBe(0);

      const sameResult = getResource(state);

      expect(result).toBe(sameResult);
    };

    const fullCase = state => () => {
      const result = getResource(state);

      expect(result.length).toBe(3);
      expect(result[0]).toBe(state.restEasy.resources.fruits['1']);
      expect(result[1]).toBe(state.restEasy.resources.fruits['2']);
      expect(result[2]).toBe(state.restEasy.resources.fruits['3']);

      const sameResult = getResource(state);

      expect(result).toBe(sameResult);
    };

    test('empty state', emptyCase(EMPTY_STATE));
    test('requested resource state', emptyCase(REQUESTED_RESOURCE_STATE));
    test(
      'received empty resource state',
      emptyCase(RECEIVED_EMPTY_RESOURCE_STATE),
    );
    test(
      'received full resource state',
      fullCase(RECEIVED_FULL_RESOURCE_STATE),
    );
    test('failed resource state', emptyCase(FAILED_RESOURCE_STATE));
  });

  describe('getResourceById', () => {
    const emptyCase = (state, id) => () => {
      expect(getResourceById(state, id)).toBeNull();
    };

    const fullCase = (state, id) => () => {
      const result = getResourceById(state, id);

      expect(result).toBe(state.restEasy.resources.fruits[id]);
    };

    test('empty state', emptyCase(EMPTY_STATE, 2));
    test('requested resource state', emptyCase(REQUESTED_RESOURCE_STATE, 2));
    test(
      'received empty resource state',
      emptyCase(RECEIVED_EMPTY_RESOURCE_STATE, 2),
    );
    test(
      'received full resource state',
      fullCase(RECEIVED_FULL_RESOURCE_STATE, 2),
    );
    test('failed resource state', emptyCase(FAILED_RESOURCE_STATE, 2));

    test(
      'requested resource id state',
      emptyCase(REQUESTED_RESOURCE_ID_STATE, 2),
    );
    test(
      'received empty resource id state',
      emptyCase(RECEIVED_EMPTY_RESOURCE_ID_STATE, 2),
    );
    test(
      'received full resource id state',
      fullCase(RECEIVED_FULL_RESOURCE_ID_STATE, 2),
    );
    test('failed resource id state', emptyCase(FAILED_RESOURCE_ID_STATE, 2));
  });
});
