import getInfosFromActionType from '../../utils/getInfosFromActionType';
import getResourceIdsByResourceNameFromNormalizedPayload from '../../utils/getResourceIdsByResourceNameFromNormalizedPayload';
import {
  computeNewResolversHashes,
  resetResourceResolversHashes,
} from '../../utils/resolversHashes';
import shallowMergeResources from '../../utils/shallowMergeResources';

const REDUCER_CASES = {
  REQUEST: (state, { type, url: normalizedURL, resourceId }) => ({
    ...state,
    requests: {
      ...(state.requests || {}),
      [normalizedURL]: {
        ...(state.requests && state.requests[normalizedURL]
          ? state.requests[normalizedURL]
          : {}),
        resourceName: getInfosFromActionType(type).resourceName,
        resourceId,
        startedAt: new Date().toISOString(),
        endedAt: null,
        expireAt: null,
        hasSucceeded:
          state.requests && state.requests[normalizedURL]
            ? state.requests[normalizedURL].hasSucceeded
            : false,
        hasFailed:
          state.requests && state.requests[normalizedURL]
            ? state.requests[normalizedURL].hasFailed
            : false,
        didInvalidate:
          state.requests && state.requests[normalizedURL]
            ? state.requests[normalizedURL].didInvalidate
            : false,
        fromCache:
          state.requests && state.requests[normalizedURL]
            ? state.requests[normalizedURL].fromCache
            : false,
      },
    },
  }),
  RECEIVE: (
    state,
    {
      type,
      url: normalizedURL,
      payload: normalizedPayload,
      principalResourceIds,
      metadata,
      cacheLifetime = 0,
    },
  ) => {
    const { resourceName } = getInfosFromActionType(type);
    const newStateOldHashes = {
      ...state,
      requests: {
        ...(state.requests || {}),
        [normalizedURL]: {
          ...(state.requests && state.requests[normalizedURL]
            ? state.requests[normalizedURL]
            : {}),
          endedAt: new Date().toISOString(),
          expireAt:
            cacheLifetime !== Infinity
              ? new Date(
                  new Date().getTime() + cacheLifetime * 1000,
                ).toISOString()
              : 'never',
          hasSucceeded: true,
          hasFailed: false,
          didInvalidate: false,
          fromCache: false,
          payloadIds: getResourceIdsByResourceNameFromNormalizedPayload(
            resourceName,
            normalizedPayload,
            principalResourceIds,
          ),
          metadata,
        },
      },
      resources: shallowMergeResources(state, normalizedPayload),
    };

    const newState = {
      ...newStateOldHashes,
      resolversHashes: computeNewResolversHashes(
        newStateOldHashes,
        resourceName,
        normalizedURL,
        normalizedPayload,
        principalResourceIds,
      ),
    };

    return newState;
  },
  FAIL: (state, { url: normalizedURL }) => ({
    ...state,
    requests: {
      ...(state.requests || {}),
      [normalizedURL]: {
        ...(state.requests && state.requests[normalizedURL]
          ? state.requests[normalizedURL]
          : {}),
        endedAt: new Date().toISOString(),
        hasSucceeded: false,
        hasFailed: true,
      },
    },
  }),
  RECEIVE_FROM_CACHE: (
    state,
    {
      type,
      url: normalizedURL,
      resourceId,
      payload: normalizedPayload,
      principalResourceIds,
      metadata,
      cacheLifetime = 0,
    },
  ) => {
    const { resourceName } = getInfosFromActionType(type);
    const newStateOldHashes = {
      ...state,
      requests: {
        ...(state.requests || {}),
        [normalizedURL]: {
          ...(state.requests && state.requests[normalizedURL]
            ? state.requests[normalizedURL]
            : {}),
          resourceName: getInfosFromActionType(type).resourceName,
          resourceId,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          expireAt:
            cacheLifetime !== Infinity
              ? new Date(
                  new Date().getTime() + cacheLifetime * 1000,
                ).toISOString()
              : 'never',
          hasSucceeded: true,
          hasFailed: false,
          didInvalidate: false,
          fromCache: true,
          payloadIds: getResourceIdsByResourceNameFromNormalizedPayload(
            resourceName,
            normalizedPayload,
            principalResourceIds,
          ),
          metadata,
        },
      },
      resources: shallowMergeResources(state, normalizedPayload),
    };

    const newState = {
      ...newStateOldHashes,
      resolversHashes: computeNewResolversHashes(
        newStateOldHashes,
        resourceName,
        normalizedURL,
        normalizedPayload,
        principalResourceIds,
      ),
    };

    return newState;
  },
  INVALIDATE_RESOURCE: (state, { resourceName }) => ({
    ...state,
    requests: {
      ...Object.entries(state.requests || {}).reduce(
        (prev, [key, request]) => ({
          ...prev,
          [key]:
            !request.didInvalidate
            && (request.resourceName === resourceName
              || (request.payloadIds && request.payloadIds[resourceName]))
              ? {
                  ...request,
                  didInvalidate: true,
                }
              : request,
        }),
        {},
      ),
    },
  }),
  INVALIDATE_ID: (state, { resourceName, resourceId }) => ({
    ...state,
    requests: {
      ...Object.entries(state.requests || {}).reduce(
        (prev, [key, request]) => ({
          ...prev,
          [key]:
            !request.didInvalidate
            && ((request.resourceName === resourceName
              && request.resourceId === resourceId)
              || (request.payloadIds
                && request.payloadIds[resourceName]
                && request.payloadIds[resourceName]
                  .map(item => item.toString())
                  .includes(resourceId.toString())))
              ? {
                  ...request,
                  didInvalidate: true,
                }
              : request,
        }),
        {},
      ),
    },
  }),
  INVALIDATE_REQUEST: (state, { url: normalizedURL }) => ({
    ...state,
    requests: {
      ...(state.requests || {}),
      [normalizedURL]: {
        ...(state.requests && state.requests[normalizedURL]
          ? state.requests[normalizedURL]
          : {}),
        didInvalidate: true,
      },
    },
  }),
  RESET_RESOURCE: (state, { resourceName }) => {
    const newStateOldHashes = {
      ...state,
      requests: {
        ...Object.entries(state.requests || {})
          .filter(
            ([, { resourceName: name, payloadIds }]) =>
              resourceName !== name
              && (!payloadIds || !Object.keys(payloadIds).includes(resourceName)),
          )
          .reduce(
            (prev, [key, request]) => ({
              ...prev,
              [key]: request,
            }),
            {},
          ),
      },
      resources: {
        ...(state.resources || {}),
        [resourceName]: undefined,
      },
    };

    const newState = {
      ...newStateOldHashes,
      resolversHashes: resetResourceResolversHashes(
        newStateOldHashes,
        resourceName,
      ),
    };

    return newState;
  },
  RESET_ALL: () => {
    const newState = {};

    return newState;
  },
};

const getReducerCases = () => REDUCER_CASES;

export default getReducerCases;
