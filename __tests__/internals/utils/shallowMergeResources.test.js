import shallowMergeResources from '../../../src/internals/utils/shallowMergeResources';

const PREVIOUS_STATE = {
  resources: {
    eggs: {
      1: {
        a: 1,
      },
    },
    fruits: {
      1: {
        a: 1,
        b: 2,
      },
      2: {
        a: 1,
        b: 2,
      },
    },
    vegetables: {
      1: {
        a: 1,
        b: 2,
        c: 3,
      },
      2: {
        a: 1,
        b: 2,
        c: 3,
      },
      3: {
        a: 1,
        b: 2,
        c: 3,
      },
    },
  },
};

const NORMALIZED_PAYLOAD = {
  eggs: {
    1: {
      a: 2,
    },
  },
  fruits: {
    1: {
      a: 1,
    },
    2: {
      c: 3,
    },
  },
  vegetables: {
    4: {
      a: 1,
    },
  },
};

describe('shallowMergeResources', () => {
  test('only path', () => {
    expect(
      shallowMergeResources(PREVIOUS_STATE, NORMALIZED_PAYLOAD),
    ).toMatchSnapshot();
  });
});
