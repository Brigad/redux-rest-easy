import hasCacheExpired from '../../utils/hasCacheExpired';

const isCacheExpired = (state, method, normalizedURL) => {
  if (
    method !== 'GET'
    || !state
    || !normalizedURL
    || !state.requests
    || !state.requests[normalizedURL]
  ) {
    return true;
  }

  const { hasSucceeded, didInvalidate, expireAt } = state.requests[
    normalizedURL
  ];

  return !hasSucceeded || didInvalidate || hasCacheExpired(expireAt);
};

export default isCacheExpired;
