import moment from 'moment';

import generateActionSelectors from '../../../src/internals/selectors/generateActionSelectors';

const {
  eat: {
    resource: {
      couldPerform: couldPerformOnResource,
      isPerforming: isPerformingOnResource,
      hasSucceeded: hasSucceededOnResource,
      hasFailed: hasFailedOnResource,
      isValid: isValidResource,
      couldPerformOnId,
      isPerformingOnId,
      hasSucceededOnId,
      hasFailedOnId,
      isValidId,
    },
    request: {
      getResource,
      getMetadata,
      couldPerform: couldPerformRequest,
      isPerforming: isPerformingRequest,
      isValid: isValidRequestResource,
      hasSucceeded: hasSuceededRequest,
      hasFailed: hasFailedRequest,
    },
  },
} = generateActionSelectors('fruits', 'eat');

const denormalizer = (resourceIds, { fruits, colors } = {}) =>
  fruits
    ? Object.values(fruits).map(fruit => ({
        ...fruit,
        color: colors[fruit.color],
      }))
    : [];
const {
  eat: { request: { getResource: getResourceWithDenormalizer } },
} = generateActionSelectors('fruits', 'eat', denormalizer);

const STARTED_AT = moment();
const ENDED_AT = moment().add(1, 'seconds');
const STARTED_AT_LATER = moment().add(1, 'minutes');
const ENDED_AT_LATER = moment()
  .add(1, 'minutes')
  .add(1, 'seconds');

const EMPTY_STATE = {
  restEasy: {},
};

const REQUESTED_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits?page=1': {
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
      'eat:https://api.co/fruits?page=1': {
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
      'eat:https://api.co/fruits?page=1': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {
          fruits: [1, 2, 3],
        },
        metadata: { resultsCount: 3 },
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

const INVALIDATED_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits?page=1': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        didInvalidate: true,
        payloadIds: {
          fruits: [1, 2, 3],
        },
        metadata: { resultsCount: 3 },
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
      'eat:https://api.co/fruits?page=1': {
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

const FAILED_THEN_RETRIEVED_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits?page=2': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: false,
        hasFailed: true,
      },
      'eat:https://api.co/fruits?page=1': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT_LATER,
        endedAt: ENDED_AT_LATER,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {},
      },
    },
  },
};

const RETRIEVED_THEN_FAILED_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits?page=2': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {},
      },
      'eat:https://api.co/fruits?page=1': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT_LATER,
        endedAt: ENDED_AT_LATER,
        hasSucceeded: false,
        hasFailed: true,
      },
    },
  },
};

const REQUESTED_OTHER_ACTION_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'drink:https://api.co/fruits?page=1': {
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

const RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'drink:https://api.co/fruits?page=1': {
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

const FAILED_OTHER_ACTION_RESOURCE_STATE = {
  restEasy: {
    requests: {
      'drink:https://api.co/fruits?page=1': {
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

const FAILED_THEN_RETRIEVED_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits/2?page=1': {
        resourceName: 'fruits',
        resourceId: 2,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: false,
        hasFailed: true,
      },
      'eat:https://api.co/fruits/2?page=2': {
        resourceName: 'fruits',
        resourceId: 2,
        startedAt: STARTED_AT_LATER,
        endedAt: ENDED_AT_LATER,
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

const RETRIEVED_THEN_FAILED_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits/2?page=2': {
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
      'eat:https://api.co/fruits/2?page=1': {
        resourceName: 'fruits',
        resourceId: 2,
        startedAt: STARTED_AT_LATER,
        endedAt: ENDED_AT_LATER,
        hasSucceeded: false,
        hasFailed: true,
      },
    },
    resources: {
      fruits: {
        2: 'cherry',
      },
    },
  },
};

const REQUESTED_OTHER_ACTION_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'drink:https://api.co/fruits': {
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

const RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'drink:https://api.co/fruits/2': {
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

const FAILED_OTHER_ACTION_RESOURCE_ID_STATE = {
  restEasy: {
    requests: {
      'drink:https://api.co/fruits/2': {
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

const RECEIVED_FULL_RESOURCE_TO_DENORMALIZE_STATE = {
  restEasy: {
    requests: {
      'eat:https://api.co/fruits?page=1': {
        resourceName: 'fruits',
        resourceId: null,
        startedAt: STARTED_AT,
        endedAt: ENDED_AT,
        hasSucceeded: true,
        hasFailed: false,
        payloadIds: {
          fruits: [1, 2],
          color: [1, 2],
        },
        metadata: { resultsCount: 3 },
      },
    },
    resources: {
      fruits: {
        1: {
          name: 'banana',
          color: '1',
        },
        2: {
          name: 'cherry',
          color: '2',
        },
      },
      colors: {
        1: 'yellow',
        2: 'red',
      },
    },
  },
};

const EMPTY_OWNPROPS = {
  __requestURLsByActionKey: {},
};

const FILLED_OWNPROPS = {
  __requestURLsByActionKey: {
    eat: 'eat:https://api.co/fruits?page=1',
  },
};

describe('generateResourceSelectors', () => {
  describe('resource', () => {
    describe('couldPerformOnResource', () => {
      const boolCheck = (state, expected) => () => {
        expect(couldPerformOnResource(state)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, true));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, false),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, true),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, true),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, true));

      test(
        'requested other action resource state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, true),
      );
      test(
        'received other action resource state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE, true),
      );
      test(
        'failed other action resource state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, true),
      );
    });

    describe('isPerformingOnResource', () => {
      const boolCheck = (state, expected) => () => {
        expect(isPerformingOnResource(state)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, false));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, true),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, false),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, false),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, false));

      test(
        'requested other action resource state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, false),
      );
      test(
        'received other action resource state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE, false),
      );
      test(
        'failed other action resource state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, false),
      );
    });

    describe('hasSucceededOnResource', () => {
      const boolCheck = (state, expected) => () => {
        expect(hasSucceededOnResource(state)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, false));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, false),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, true),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, true),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, false));

      test(
        'failed then retrieved resource state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, true),
      );
      test(
        'retrieved then failed resource state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, false),
      );

      test(
        'requested other action resource state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, false),
      );
      test(
        'received other action resource state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE, false),
      );
      test(
        'failed other action resource state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, false),
      );
    });

    describe('hasFailedOnResource', () => {
      const boolCheck = (state, expected) => () => {
        expect(hasFailedOnResource(state)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, false));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, false),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, false),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, false),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, true));

      test(
        'failed then retrieved resource state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, false),
      );
      test(
        'retrieved then failed resource state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, true),
      );

      test(
        'requested other action resource state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, false),
      );
      test(
        'received other action resource state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE, false),
      );
      test(
        'failed other action resource state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, false),
      );
    });

    describe('isValidResource', () => {
      const boolCheck = (state, expected) => () => {
        expect(isValidResource(state)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, true));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, true),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, true),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, true),
      );
      test(
        'invalidated resource state',
        boolCheck(INVALIDATED_RESOURCE_STATE, false),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, true));

      test(
        'requested other action resource state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, true),
      );
      test(
        'received other action resource state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE, true),
      );
      test(
        'failed other action resource state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, true),
      );
    });

    describe('couldPerformOnId', () => {
      const boolCheck = (state, id, expected) => () => {
        expect(couldPerformOnId(state, id)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, 2, true));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, 2, true),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, 2, true),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, 2, true),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, 2, true));

      test(
        'requested resource id state',
        boolCheck(REQUESTED_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received empty resource id state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received full resource id state',
        boolCheck(RECEIVED_FULL_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'failed resource id state',
        boolCheck(FAILED_RESOURCE_ID_STATE, 2, true),
      );

      test(
        'requested other action resource id state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received other action resource id state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'failed other action resource id state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_ID_STATE, 2, true),
      );
    });

    describe('isPerformingOnId', () => {
      const boolCheck = (state, id, expected) => () => {
        expect(isPerformingOnId(state, id)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, 2, false));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, 2, false),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, 2, false),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, 2, false),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, 2, false));

      test(
        'requested resource id state',
        boolCheck(REQUESTED_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received empty resource id state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received full resource id state',
        boolCheck(RECEIVED_FULL_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'failed resource id state',
        boolCheck(FAILED_RESOURCE_ID_STATE, 2, false),
      );

      test(
        'requested other action resource id state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received other action resource id state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'failed other action resource id state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_ID_STATE, 2, false),
      );
    });

    describe('hasSucceededOnId', () => {
      const boolCheck = (state, id, expected) => () => {
        expect(hasSucceededOnId(state, id)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, 2, false));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, 2, false),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, 2, false),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, 2, true),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, 2, false));

      test(
        'failed then retrieved resource state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, 2, false),
      );
      test(
        'retrieved then failed resource state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, 2, false),
      );

      test(
        'requested resource id state',
        boolCheck(REQUESTED_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received empty resource id state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received full resource id state',
        boolCheck(RECEIVED_FULL_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'failed resource id state',
        boolCheck(FAILED_RESOURCE_ID_STATE, 2, false),
      );

      test(
        'failed then retrieved resource id state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'retrieved then failed resource id state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_ID_STATE, 2, false),
      );

      test(
        'requested other action resource id state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received other action resource id state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'failed other action resource id state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_ID_STATE, 2, false),
      );
    });

    describe('hasFailedOnId', () => {
      const boolCheck = (state, id, expected) => () => {
        expect(hasFailedOnId(state, id)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, 2, false));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, 2, false),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, 2, false),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, 2, false),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, 2, false));

      test(
        'failed then retrieved resource state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, 2, false),
      );
      test(
        'retrieved then failed resource state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, 2, false),
      );

      test(
        'requested resource id state',
        boolCheck(REQUESTED_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received empty resource id state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received full resource id state',
        boolCheck(RECEIVED_FULL_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'failed resource id state',
        boolCheck(FAILED_RESOURCE_ID_STATE, 2, true),
      );

      test(
        'failed then retrieved resource id state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'retrieved then failed resource id state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_ID_STATE, 2, true),
      );

      test(
        'requested other action resource id state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'received other action resource id state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_ID_STATE, 2, false),
      );
      test(
        'failed other action resource id state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_ID_STATE, 2, false),
      );
    });

    describe('isValidId', () => {
      const boolCheck = (state, id, expected) => () => {
        expect(isValidId(state, id)).toBe(expected);
      };

      test('empty state', boolCheck(EMPTY_STATE, 2, true));
      test(
        'requested resource state',
        boolCheck(REQUESTED_RESOURCE_STATE, 2, true),
      );
      test(
        'received empty resource state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, 2, true),
      );
      test(
        'received full resource state',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, 2, true),
      );
      test(
        'invalidated resource state',
        boolCheck(INVALIDATED_RESOURCE_STATE, 2, false),
      );
      test('failed resource state', boolCheck(FAILED_RESOURCE_STATE, 2, true));

      test(
        'failed then retrieved resource state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, 2, true),
      );
      test(
        'retrieved then failed resource state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, 2, true),
      );

      test(
        'requested resource id state',
        boolCheck(REQUESTED_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received empty resource id state',
        boolCheck(RECEIVED_EMPTY_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received full resource id state',
        boolCheck(RECEIVED_FULL_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'failed resource id state',
        boolCheck(FAILED_RESOURCE_ID_STATE, 2, true),
      );

      test(
        'failed then retrieved resource id state',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'retrieved then failed resource id state',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_ID_STATE, 2, true),
      );

      test(
        'requested other action resource id state',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'received other action resource id state',
        boolCheck(RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_ID_STATE, 2, true),
      );
      test(
        'failed other action resource id state',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_ID_STATE, 2, true),
      );
    });
  });

  describe('request', () => {
    describe('getResource', () => {
      const emptyCase = (state, ownProps) => () => {
        const result = getResource(state, ownProps);

        expect(result.length).toBe(0);

        const sameResult = getResource(state, ownProps);

        expect(result).toBe(sameResult);
      };

      const fullCase = (state, ownProps) => () => {
        const result = getResource(state, ownProps);

        expect(result.length).toBe(3);
        expect(result[0]).toBe(state.restEasy.resources.fruits['1']);
        expect(result[1]).toBe(state.restEasy.resources.fruits['2']);
        expect(result[2]).toBe(state.restEasy.resources.fruits['3']);

        const sameResult = getResource(state, ownProps);

        expect(result).toBe(sameResult);
      };

      test(
        'empty state, empty ownprops',
        emptyCase(EMPTY_STATE, EMPTY_OWNPROPS),
      );
      test(
        'requested resource state, empty ownprops',
        emptyCase(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS),
      );
      test(
        'received empty resource state, empty ownprops',
        emptyCase(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS),
      );
      test(
        'received full resource state, empty ownprops',
        emptyCase(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS),
      );
      test(
        'failed resource state, empty ownprops',
        emptyCase(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS),
      );

      test(
        'empty state, filled ownprops',
        emptyCase(EMPTY_STATE, FILLED_OWNPROPS),
      );
      test(
        'requested resource state, filled ownprops',
        emptyCase(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS),
      );
      test(
        'received empty resource state, filled ownprops',
        emptyCase(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS),
      );
      test(
        'received full resource state, filled ownprops',
        fullCase(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS),
      );
      test(
        'failed resource state, filled ownprops',
        emptyCase(FAILED_RESOURCE_STATE, FILLED_OWNPROPS),
      );
    });

    describe('getResource with denormalizer', () => {
      const fullCase = (state, ownProps) => () => {
        const result = getResourceWithDenormalizer(state, ownProps);

        expect(result.length).toBe(2);
        expect(result[0].color).toBe(state.restEasy.resources.colors['1']);
        expect(result[1].color).toBe(state.restEasy.resources.colors['2']);

        const sameResult = getResourceWithDenormalizer(state, ownProps);

        expect(result).toBe(sameResult);
      };

      test(
        'received full resource state, filled ownprops',
        fullCase(RECEIVED_FULL_RESOURCE_TO_DENORMALIZE_STATE, FILLED_OWNPROPS),
      );
    });

    describe('getMetadata', () => {
      const emptyCase = (state, ownProps) => () => {
        const result = getMetadata(state, ownProps);

        expect(Object.keys(result).length).toBe(0);
      };

      const fullCase = (state, ownProps) => () => {
        const result = getMetadata(state, ownProps);

        expect(Object.keys(result).length).toBe(1);
        expect(result.resultsCount).toBe(3);
      };

      test(
        'empty state, empty ownprops',
        emptyCase(EMPTY_STATE, EMPTY_OWNPROPS),
      );
      test(
        'requested resource state, empty ownprops',
        emptyCase(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS),
      );
      test(
        'received empty resource state, empty ownprops',
        emptyCase(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS),
      );
      test(
        'received full resource state, empty ownprops',
        emptyCase(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS),
      );
      test(
        'failed resource state, empty ownprops',
        emptyCase(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS),
      );

      test(
        'empty state, filled ownprops',
        emptyCase(EMPTY_STATE, FILLED_OWNPROPS),
      );
      test(
        'requested resource state, filled ownprops',
        emptyCase(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS),
      );
      test(
        'received empty resource state, filled ownprops',
        emptyCase(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS),
      );
      test(
        'received full resource state, filled ownprops',
        fullCase(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS),
      );
      test(
        'failed resource state, filled ownprops',
        emptyCase(FAILED_RESOURCE_STATE, FILLED_OWNPROPS),
      );
    });

    describe('couldPerformRequest', () => {
      const boolCheck = (state, ownProps, expected) => () => {
        expect(couldPerformRequest(state, ownProps)).toBe(expected);
      };

      test(
        'empty state, empty ownprops',
        boolCheck(EMPTY_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'requested resource state, empty ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'received empty resource state, empty ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'received full resource state, empty ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'failed resource state, empty ownprops',
        boolCheck(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );

      test(
        'empty state, filled ownprops',
        boolCheck(EMPTY_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'requested resource state, filled ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'received empty resource state, filled ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received full resource state, filled ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'failed resource state, filled ownprops',
        boolCheck(FAILED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );

      test(
        'requested other action resource state, filled ownprops',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received other action resource state, filled ownprops',
        boolCheck(
          RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE,
          FILLED_OWNPROPS,
          true,
        ),
      );
      test(
        'failed other action resource state, filled ownprops',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
    });

    describe('isPerformingRequest', () => {
      const boolCheck = (state, ownProps, expected) => () => {
        expect(isPerformingRequest(state, ownProps)).toBe(expected);
      };

      test(
        'empty state, empty ownprops',
        boolCheck(EMPTY_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'requested resource state, empty ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'received empty resource state, empty ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'received full resource state, empty ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'failed resource state, empty ownprops',
        boolCheck(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );

      test(
        'empty state, filled ownprops',
        boolCheck(EMPTY_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'requested resource state, filled ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received empty resource state, filled ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'received full resource state, filled ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'failed resource state, filled ownprops',
        boolCheck(FAILED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );

      test(
        'requested other action resource state, filled ownprops',
        boolCheck(
          REQUESTED_OTHER_ACTION_RESOURCE_STATE,
          FILLED_OWNPROPS,
          false,
        ),
      );
      test(
        'received other action resource state, filled ownprops',
        boolCheck(
          RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE,
          FILLED_OWNPROPS,
          false,
        ),
      );
      test(
        'failed other action resource state, filled ownprops',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
    });

    describe('hasSuceededRequest', () => {
      const boolCheck = (state, ownProps, expected) => () => {
        expect(hasSuceededRequest(state, ownProps)).toBe(expected);
      };

      test(
        'empty state, empty ownprops',
        boolCheck(EMPTY_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'requested resource state, empty ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'received empty resource state, empty ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'received full resource state, empty ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'failed resource state, empty ownprops',
        boolCheck(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );

      test(
        'failed then retrieved resource state, empty ownprops',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'retrieved then failed resource state, empty ownprops',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );

      test(
        'empty state, filled ownprops',
        boolCheck(EMPTY_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'requested resource state, filled ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'received empty resource state, filled ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received full resource state, filled ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'failed resource state, filled ownprops',
        boolCheck(FAILED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );

      test(
        'failed then retrieved resource state, filled ownprops',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'retrieved then failed resource state, filled ownprops',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );

      test(
        'requested other action resource state, filled ownprops',
        boolCheck(
          REQUESTED_OTHER_ACTION_RESOURCE_STATE,
          FILLED_OWNPROPS,
          false,
        ),
      );
      test(
        'received other action resource state, filled ownprops',
        boolCheck(
          RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE,
          FILLED_OWNPROPS,
          false,
        ),
      );
      test(
        'failed other action resource state, filled ownprops',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
    });

    describe('hasFailedRequest', () => {
      const boolCheck = (state, ownProps, expected) => () => {
        expect(hasFailedRequest(state, ownProps)).toBe(expected);
      };

      test(
        'empty state, empty ownprops',
        boolCheck(EMPTY_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'requested resource state, empty ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'received empty resource state, empty ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'received full resource state, empty ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'failed resource state, empty ownprops',
        boolCheck(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );

      test(
        'failed then retrieved resource state, empty ownprops',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );
      test(
        'retrieved then failed resource state, empty ownprops',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, false),
      );

      test(
        'empty state, filled ownprops',
        boolCheck(EMPTY_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'requested resource state, filled ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'received empty resource state, filled ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'received full resource state, filled ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'failed resource state, filled ownprops',
        boolCheck(FAILED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );

      test(
        'failed then retrieved resource state, filled ownprops',
        boolCheck(FAILED_THEN_RETRIEVED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'retrieved then failed resource state, filled ownprops',
        boolCheck(RETRIEVED_THEN_FAILED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );

      test(
        'requested other action resource state, filled ownprops',
        boolCheck(
          REQUESTED_OTHER_ACTION_RESOURCE_STATE,
          FILLED_OWNPROPS,
          false,
        ),
      );
      test(
        'received other action resource state, filled ownprops',
        boolCheck(
          RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE,
          FILLED_OWNPROPS,
          false,
        ),
      );
      test(
        'failed other action resource state, filled ownprops',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
    });

    describe('isValidRequestResource', () => {
      const boolCheck = (state, ownProps, expected) => () => {
        expect(isValidRequestResource(state, ownProps)).toBe(expected);
      };

      test(
        'empty state, empty ownprops',
        boolCheck(EMPTY_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'requested resource state, empty ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'received empty resource state, empty ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'received full resource state, empty ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'invalidated resource state, empty ownprops',
        boolCheck(INVALIDATED_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );
      test(
        'failed resource state, empty ownprops',
        boolCheck(FAILED_RESOURCE_STATE, EMPTY_OWNPROPS, true),
      );

      test(
        'empty state, filled ownprops',
        boolCheck(EMPTY_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'requested resource state, filled ownprops',
        boolCheck(REQUESTED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received empty resource state, filled ownprops',
        boolCheck(RECEIVED_EMPTY_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received full resource state, filled ownprops',
        boolCheck(RECEIVED_FULL_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'invalidated resource state, filled ownprops',
        boolCheck(INVALIDATED_RESOURCE_STATE, FILLED_OWNPROPS, false),
      );
      test(
        'failed resource state, filled ownprops',
        boolCheck(FAILED_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );

      test(
        'requested other action resource state, filled ownprops',
        boolCheck(REQUESTED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
      test(
        'received other action resource state, filled ownprops',
        boolCheck(
          RECEIVED_OTHER_ACTION_EMPTY_RESOURCE_STATE,
          FILLED_OWNPROPS,
          true,
        ),
      );
      test(
        'failed other action resource state, filled ownprops',
        boolCheck(FAILED_OTHER_ACTION_RESOURCE_STATE, FILLED_OWNPROPS, true),
      );
    });
  });
});
