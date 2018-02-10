import getDefaultNetworkHelpers from './getDefaultNetworkHelpers';

const DEFAULT_NETWORK_HELPERS = getDefaultNetworkHelpers();

let networkHelpers = DEFAULT_NETWORK_HELPERS;

export const setNetworkHelpers = (helpers) => {
  networkHelpers = helpers
    ? { ...DEFAULT_NETWORK_HELPERS, ...helpers }
    : DEFAULT_NETWORK_HELPERS;
};

export const getNetworkHelpers = () => networkHelpers;
