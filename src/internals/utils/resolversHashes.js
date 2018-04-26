import getResourceIdsByResourceNameFromNormalizedPayload from '../utils/getResourceIdsByResourceNameFromNormalizedPayload';
import hash from '../utils/hash';

const EMPTY_RESOURCE = [];
const EMPTY_HASH = hash(EMPTY_RESOURCE);

export const computeNewResolversHashes = (
  { requests = {}, resources = {}, resolversHashes = {} },
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

  return {
    ...resolversHashes,
    requests: {
      ...(resolversHashes.requests || {}),
      [normalizedURL]: Object.keys(resourceIdsByResourceName).reduce(
        (prev, resourceKey) => ({
          ...prev,
          [resourceKey]:
            requests[normalizedURL]
            && requests[normalizedURL].payloadIds
            && requests[normalizedURL].payloadIds[resourceKey]
              ? hash(requests[normalizedURL].payloadIds[resourceKey])
              : EMPTY_HASH,
        }),
        {},
      ),
    },
    resources: {
      ...(resolversHashes.resources || {}),
      // Computed on demand instead, because rarely used and expensive
      _getResourcesHash: () => hash(resources),
      [resourceName]: resources[resourceName]
        ? hash(resources[resourceName])
        : EMPTY_HASH,
    },
  };
};

export const resetResourceResolversHashes = (
  { requests = {}, resolversHashes = {} },
  resourceName,
) => ({
  ...resolversHashes,
  requests: {
    ...Object.entries(resolversHashes.requests || {}).reduce(
      (prev, [normalizedURL, value]) => ({
        ...prev,
        ...(Object.keys(requests).includes(normalizedURL)
          ? { [normalizedURL]: value }
          : {}),
      }),
      {},
    ),
  },
  resources: {
    ...(resolversHashes.resources || {}),
    [resourceName]: EMPTY_HASH,
  },
});

export const getEmptyResourceHash = () => EMPTY_HASH;

export const getPayloadIdsHash = (
  { resolversHashes = {} } = {},
  normalizedURL,
  resourceName,
) =>
  resolversHashes.requests
  && resolversHashes.requests[normalizedURL]
  && resolversHashes.requests[normalizedURL][resourceName]
    ? resolversHashes.requests[normalizedURL][resourceName]
    : EMPTY_HASH;

/* eslint-disable no-underscore-dangle */
export const getResourcesHash = ({ resolversHashes = {} } = {}) =>
  resolversHashes.resources && resolversHashes.resources._getResourcesHash
    ? resolversHashes.resources._getResourcesHash()
    : EMPTY_HASH;
/* eslint-enable no-underscore-dangle */

export const getResourceHash = ({ resolversHashes = {} } = {}, resourceName) =>
  resolversHashes.resources && resolversHashes.resources[resourceName]
    ? resolversHashes.resources[resourceName]
    : EMPTY_HASH;
