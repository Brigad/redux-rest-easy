import defaultNetworkHelpers from './getDefaultNetworkHelpers';

let networkHelpers;

export const setNetworkHelpers = (helpers) => {
  networkHelpers = helpers;
};

export const getNetworkHelpers = () =>
  networkHelpers || defaultNetworkHelpers();
