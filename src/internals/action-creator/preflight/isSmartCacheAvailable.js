import hasCacheExpired from '../../utils/hasCacheExpired';
import { areIdsEqual, payloadIdsInclude } from '../../utils/safeIds';

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
      && ((resourceName === name && areIdsEqual(resourceId, id))
        || (payloadIds
          && payloadIds[resourceName]
          && payloadIdsInclude(payloadIds[resourceName], resourceId)))
      && !hasCacheExpired(expireAt),
  );
};

export default isSmartCacheAvailable;
