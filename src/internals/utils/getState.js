/* eslint-disable no-console */

const getState = (state) => {
  if (!state || !state.restEasy) {
    console.error(
      'There doesn\'t seem to be a "restEasy" key in your state. In doubt, double check the docs on reducers.',
    );
    return null;
  }

  return state.restEasy;
};

export default getState;
