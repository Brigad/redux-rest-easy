import mergeResources from '../../../src/internals/utils/mergeResources';

const EMPTY_STATE = {};
const FILLED_STATE = {
  resources: {
    fruits: {
      apple: {
        juicy: true,
        red: true,
      },
      cherry: {
        juicy: false,
      },
    },
    vegetables: {
      carrot: {
        orange: true,
      },
    },
  },
};
const FILLED_STATE2 = {
  resources: {
    fruits: {
      apple: {
        juicy: false,
      },
      banana: {
        yellow: true,
      },
    },
  },
};

describe('mergeResources', () => {
  test('merge filled in empty', () => {
    expect(
      mergeResources(EMPTY_STATE, FILLED_STATE.resources),
    ).toMatchSnapshot();
  });

  test('merge empty in filled', () => {
    expect(
      mergeResources(FILLED_STATE, EMPTY_STATE.resources),
    ).toMatchSnapshot();
  });

  test('merge filled2 in filled', () => {
    expect(
      mergeResources(FILLED_STATE, FILLED_STATE2.resources),
    ).toMatchSnapshot();
  });
});
