import mergeResources from '../../../src/internals/utils/mergeResources';

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

describe('mergeResources', () => {
  test('bad arguments', () => {
    expect(Object.keys(mergeResources()).length).toBe(0);
    expect(mergeResources(PREVIOUS_STATE)).toBe(PREVIOUS_STATE.resources);
    expect(mergeResources(PREVIOUS_STATE, null)).toBe(PREVIOUS_STATE.resources);
    expect(mergeResources(PREVIOUS_STATE, 1)).toBe(PREVIOUS_STATE.resources);
    expect(mergeResources(PREVIOUS_STATE, {})).toBe(PREVIOUS_STATE.resources);
  });

  test('happy path', () => {
    expect(
      mergeResources(PREVIOUS_STATE, NORMALIZED_PAYLOAD),
    ).toMatchSnapshot();
  });
});
