import { createSelectorCreator } from 'reselect';

const RERESELECTOPTIONS = {
  selectorCreator: createSelectorCreator((func) => {
    let lastResult = null;

    return (...args) => {
      if (!lastResult) {
        lastResult = func(...args);
      }

      return lastResult;
    };
  }),
};

const getReReselectOptions = () => RERESELECTOPTIONS;

export default getReReselectOptions;
