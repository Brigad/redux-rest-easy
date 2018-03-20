import hasCacheExpired from '../../utils/hasCacheExpired';

const isSmartCacheAvailable = (state, method, resourceName, resourceId) => {
  if (
    method !== 'GET'
    || !state
    || !state.requests
    || !resourceName
    || resourceId === null
  ) {
    return false;
  }

  return Object.values(state.requests).some(
    ({
      hasSucceeded,
      didInvalidate,
      expireAt,
      resourceName: name,
      resourceId: id,
      payloadIds,
    }) =>
      hasSucceeded
      && !didInvalidate
      && ((resourceName === name && resourceId === id)
        || (payloadIds
          && payloadIds[resourceName]
          && payloadIds[resourceName].includes(resourceId)))
      && !hasCacheExpired(expireAt),
  );
};

export default isSmartCacheAvailable;
