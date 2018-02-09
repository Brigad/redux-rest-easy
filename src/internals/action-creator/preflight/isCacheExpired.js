import hasCacheExpired from '../../utils/hasCacheExpired';

const isCacheExpired = (state, method, normalizedURL, cacheLifetime) => {
  if (
    method !== 'GET'
    || !state
    || !normalizedURL
    || !state.requests
    || !state.requests[normalizedURL]
  ) {
    return true;
  }

  const { hasSucceeded, didInvalidate, endedAt } = state.requests[
    normalizedURL
  ];

  return (
    !hasSucceeded || didInvalidate || hasCacheExpired(endedAt, cacheLifetime)
  );
};

export default isCacheExpired;
