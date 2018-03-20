import hasCacheExpired from '../utils/hasCacheExpired';

const getPrunedForPersistenceState = (state) => {
  if (!state || !Object.keys(state).length) {
    return {};
  }

  const newRequests = Object.entries(state.requests || {}).reduce(
    (allRequests, [key, request]) => ({
      ...allRequests,
      ...(request.endedAt
      && !request.didInvalidate
      && !hasCacheExpired(request.expireAt)
        ? {
            [key]:
              request.expireAt === 'never'
                ? { ...request, expireAt: new Date().toISOString() }
                : request,
          }
        : {}),
    }),
    {},
  );

  const referencedResources = Object.values(newRequests || {}).reduce(
    (allResources, request) => ({
      ...allResources,
      ...Object.entries(request.payloadIds || {}).reduce(
        (requestResources, [resourceName, resourceIds]) => ({
          ...requestResources,
          [resourceName]: [
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

  const newResourcesCleaned = Object.entries(newResources || {}).reduce(
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
        && Object.length((state.resources || {})[key])
          === Object.keys(newResourcesCleaned.key).length
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
