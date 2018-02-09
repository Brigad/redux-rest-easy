import getResourceIdsByResourceNameFromNormalizedPayload from '../utils/getResourceIdsByResourceNameFromNormalizedPayload';
import hash from '../utils/hash';

const EMPTY_RESOURCE = [];
const EMPTY_HASH = hash(EMPTY_RESOURCE);

const INITIAL_HASHES = {
  empty: EMPTY_HASH,
  requests: {},
  resources: {},
};

let hashes = {
  ...INITIAL_HASHES,
};

export const computeHashesForSelectorsResolvers = (
  state,
  resourceName,
  normalizedURL,
  normalizedPayload,
  principalResourceIds,
) => {
  const resourceIdsByResourceName = getResourceIdsByResourceNameFromNormalizedPayload(
    resourceName,
    normalizedPayload,
    principalResourceIds,
  );
  const newRequestHashes = Object.keys(resourceIdsByResourceName).reduce(
    (prev, resourceKey) => ({
      ...prev,
      [resourceKey]:
        state
        && state.requests
        && state.requests[normalizedURL]
        && state.requests[normalizedURL].payloadIds
        && state.requests[normalizedURL].payloadIds[resourceKey]
          ? hash(state.requests[normalizedURL].payloadIds[resourceKey])
          : EMPTY_HASH,
    }),
    {},
  );

  hashes = {
    ...hashes,
    requests: {
      ...hashes.requests,
      [normalizedURL]: newRequestHashes,
    },
    resources: {
      ...hashes.resources,
      // Computed on demand instead, because rarely used and expensive
      _getResourcesHash: () => hash(state.resources),
      [resourceName]:
        state.resources && state.resources[resourceName]
          ? hash(state.resources[resourceName])
          : EMPTY_HASH,
    },
  };
};

export const resetResourceHashForSelectorsResolvers = (
  newState,
  resourceName,
) => {
  hashes = {
    ...hashes,
    requests: {
      ...Object.entries(hashes.requests).reduce(
        (prev, [normalizedURL, value]) => ({
          ...prev,
          ...(Object.keys(newState.requests).includes(normalizedURL)
            ? { [normalizedURL]: value }
            : {}),
        }),
        {},
      ),
    },
    resources: {
      ...hashes.resources,
      [resourceName]: EMPTY_HASH,
    },
  };
};

export const resetAllResourcesHashForSelectorsResolvers = () => {
  hashes = {
    ...INITIAL_HASHES,
  };
};

export const getEmptyResourceHash = () => hashes.empty;

export const getPayloadIdsHash = (normalizedURL, resourceName) =>
  hashes.requests[normalizedURL]
    ? hashes.requests[normalizedURL][resourceName]
    : EMPTY_HASH;

/* eslint-disable no-underscore-dangle */
export const getResourcesHash = () =>
  hashes.resources._getResourcesHash
    ? hashes.resources._getResourcesHash()
    : EMPTY_HASH;
/* eslint-enable no-underscore-dangle */

export const getResourceHash = resourceName =>
  hashes.resources[resourceName] ? hashes.resources[resourceName] : EMPTY_HASH;
