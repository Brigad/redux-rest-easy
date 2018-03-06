/* eslint-disable no-console */

const getState = (state) => {
  if (!state || !state.restEasy) {
    console.error(`
      There doesn't seem to be a "restEasy" key in your state.

      For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/reducer.md#reducer
    `);
    return null;
  }

  return state.restEasy;
};

export default getState;
