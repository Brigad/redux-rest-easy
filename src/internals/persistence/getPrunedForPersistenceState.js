/* eslint-disable no-nested-ternary */

import hasCacheExpired from '../utils/hasCacheExpired';

const getPrunedForPersistenceState = (
  state,
  { alwaysPersist, neverPersist } = {},
) => {
  if (!state || !Object.keys(state).length) {
    return {};
  }

  const alwaysPersistResources
    = typeof alwaysPersist === 'string' ? [alwaysPersist] : alwaysPersist;
  const neverPersistResources
    = typeof neverPersist === 'string' ? [neverPersist] : neverPersist;

  const newRequests = Object.entries(state.requests || {}).reduce(
    (allRequests, [key, request]) => ({
      ...allRequests,
      ...(request
      && request.endedAt
      && alwaysPersistResources
      && request.payloadIds
      && Object.keys(request.payloadIds).some(resourceName =>
        alwaysPersistResources.includes(resourceName),
      )
        ? { [key]: request }
        : request
          && request.endedAt
          && !request.didInvalidate
          && !hasCacheExpired(request.expireAt)
          && !(
            neverPersistResources
            && request.payloadIds
            && Object.keys(request.payloadIds).some(resourceName =>
              neverPersistResources.includes(resourceName),
            )
          )
          ? {
              [key]:
                request.expireAt === 'never'
                  ? { ...request, didInvalidate: true }
                  : request,
            }
          : {}),
    }),
    {},
  );

  const referencedResources = Object.values(newRequests).reduce(
    (allResources, request) => ({
      ...allResources,
      ...Object.entries(request.payloadIds || {}).reduce(
        (requestResources, [resourceName, resourceIds]) => ({
          ...requestResources,
          [resourceName]: [
            ...(allResources[resourceName] || []),
            ...(requestResources[resourceName] || []),
            ...resourceIds.map(id => id.toString()),
          ],
        }),
        {},
      ),
    }),
    {},
  );

  const newResources = Object.entries(state.resources || {}).reduce(
    (allResources, [resourceName, resourceMap]) => ({
      ...allResources,
      [resourceName]: Object.entries(resourceMap || {}).reduce(
        (allResource, [resourceId, resourceItem]) => ({
          ...allResource,
          ...(referencedResources[resourceName]
          && referencedResources[resourceName].includes(resourceId)
            ? { [resourceId]: resourceItem }
            : {}),
        }),
        {},
      ),
    }),
    {},
  );

  const newResourcesCleaned = Object.entries(newResources).reduce(
    (allResources, [resourceName, resourceMap]) => ({
      ...allResources,
      ...(Object.keys(resourceMap).length
        ? { [resourceName]: resourceMap }
        : {}),
    }),
    {},
  );

  const newResolversHashes = {
    ...(state.resolversHashes || {}),
    requests: Object.entries(
      state.resolversHashes && state.resolversHashes.requests
        ? state.resolversHashes.requests
        : {},
    ).reduce(
      (requestsHashes, [key, hashesByResourceName]) => ({
        ...requestsHashes,
        ...(newRequests[key] ? { [key]: hashesByResourceName } : {}),
      }),
      {},
    ),
    resources: Object.entries(
      state.resolversHashes && state.resolversHashes.resources
        ? state.resolversHashes.resources
        : {},
    ).reduce(
      (resourcesHashes, [key, hash]) => ({
        ...resourcesHashes,
        ...(newResourcesCleaned[key]
        && Object.keys(state.resources[key]).length
          === Object.keys(newResourcesCleaned[key]).length
          ? { [key]: hash }
          : {}),
      }),
      {},
    ),
  };

  const newState = {
    ...state,
    requests: newRequests,
    resources: newResourcesCleaned,
    resolversHashes: newResolversHashes,
  };

  return newState;
};

export default getPrunedForPersistenceState;
