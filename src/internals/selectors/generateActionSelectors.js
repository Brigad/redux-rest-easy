import createCachedSelector from 're-reselect';

import getActionNameFromNormalizedURL from '../utils/getActionNameFromNormalizedURL';
import getNormalizedURLFromOwnProps from '../utils/getNormalizedURLFromOwnProps';
import getReReselectOptions from '../utils/getReReselectOptions';
import getState from '../utils/getState';
import {
  getEmptyResourceHash,
  getPayloadIdsHash,
  getResourceHash,
} from '../utils/resolversHashes';

/* eslint-disable no-underscore-dangle */

const EMPTY_RESOURCE = [];

const areIdsEqual = (id1, id2) => {
  const safeId1 = typeof id1 === 'number' ? id1.toString() : id1;
  const safeId2 = typeof id2 === 'number' ? id2.toString() : id2;

  return safeId1 === safeId2;
};

const isPerformingOnResourceOrId = (
  state,
  resourceName,
  actionName,
  resourceId = -1,
) =>
  !!state.requests
  && Object.entries(state.requests).some(
    ([normalizedURL, { resourceName: name, resourceId: id, endedAt }]) =>
      getActionNameFromNormalizedURL(normalizedURL) === actionName
      && name === resourceName
      && (resourceId === -1 || (id !== null && areIdsEqual(id, resourceId)))
      && !endedAt,
  );

const checkKeyForResourceOrId = (
  state,
  resourceName,
  actionName,
  keyToCheck,
  resourceId = -1,
) => {
  const resourceRelatedRequests
    = state.requests
    && Object.entries(state.requests)
      .filter(
        ([
          normalizedURL,
          { resourceName: name, resourceId: id, endedAt, payloadIds },
        ]) =>
          getActionNameFromNormalizedURL(normalizedURL) === actionName
          && name === resourceName
          && (resourceId === -1
            || (id !== null && areIdsEqual(id, resourceId))
            || (!!endedAt
              && payloadIds
              && payloadIds[resourceName]
              && payloadIds[resourceName].includes(resourceId))),
      )
      .map(([, request]) => request);

  if (!resourceRelatedRequests || !resourceRelatedRequests.length) {
    return false;
  }

  const lastRequest = resourceRelatedRequests.reduce((latest, curr) => {
    if (!curr.endedAt) {
      return latest;
    }

    return latest.endedAt && curr.endedAt > latest.endedAt ? curr : latest;
  }, resourceRelatedRequests[0]);

  return lastRequest[keyToCheck];
};

const resourcesSelector = state => state.resources;

const resourceSelector = (state, resourceName) =>
  state.resources && state.resources[resourceName]
    ? state.resources[resourceName]
    : null;

const payloadIdsSelector = (state, resourceName, normalizedURL) =>
  state.requests
  && state.requests[normalizedURL]
  && state.requests[normalizedURL].payloadIds
  && state.requests[normalizedURL].payloadIds[resourceName]
    ? state.requests[normalizedURL].payloadIds[resourceName]
    : null;

const applyDenormalizerSelector = (
  state,
  resourceName,
  normalizedURL,
  applyDenormalizer,
) => applyDenormalizer;

const denormalizerSelector = (
  state,
  resourceName,
  normalizedURL,
  applyDenormalizer,
  denormalizer,
) => denormalizer;

const getRequestResourceSelector = (
  resources,
  resource,
  payloadIds,
  applyDenormalizer,
  denormalizer,
) => {
  if (!resource || !payloadIds) {
    return EMPTY_RESOURCE;
  }

  return !applyDenormalizer || !denormalizer
    ? payloadIds.reduce((prev, payloadId) => [...prev, resource[payloadId]], [])
    : denormalizer(payloadIds, resources);
};

const getRequestResourceResolver = (
  state,
  resourceName,
  normalizedURL,
  applyDenormalizer,
  denormalizer,
) => {
  const resource = resourceSelector(state, resourceName);
  const payloadIds = payloadIdsSelector(state, resourceName, normalizedURL);

  if (resource && payloadIds) {
    return !applyDenormalizer || !denormalizer
      ? `${applyDenormalizer}-${getPayloadIdsHash(
          state,
          normalizedURL,
          resourceName,
        )}-${getResourceHash(state, resourceName)}`
      : `${applyDenormalizer}-${Object.keys(
          state.requests[normalizedURL].payloadIds,
        )
          .map(
            resourceKey =>
              `${getPayloadIdsHash(
                state,
                normalizedURL,
                resourceKey,
              )}-${getResourceHash(state, resourceKey)}`,
          )
          .join('--')}`;
  }

  return getEmptyResourceHash();
};

const getRequestResource = createCachedSelector(
  resourcesSelector,
  resourceSelector,
  payloadIdsSelector,
  applyDenormalizerSelector,
  denormalizerSelector,
  getRequestResourceSelector,
)(getRequestResourceResolver, getReReselectOptions());

const getRequestMetadata = (state, normalizedURL) =>
  state.requests
  && state.requests[normalizedURL]
  && state.requests[normalizedURL].metadata
    ? state.requests[normalizedURL].metadata
    : {};

const isPerformingRequest = (state, normalizedURL) =>
  !!(
    state.requests
    && state.requests[normalizedURL]
    && !state.requests[normalizedURL].endedAt
  );

const checkKeyForRequest = (state, normalizedURL, keyToCheck) =>
  !!(
    state.requests
    && state.requests[normalizedURL]
    && state.requests[normalizedURL][keyToCheck]
  );

const generateActionSelectors = (resourceName, actionName, denormalizer) => ({
  [actionName]: {
    resource: {
      couldPerform: state =>
        !isPerformingOnResourceOrId(getState(state), resourceName, actionName),
      isPerforming: state =>
        isPerformingOnResourceOrId(getState(state), resourceName, actionName),
      isValid: state =>
        !checkKeyForResourceOrId(
          getState(state),
          resourceName,
          actionName,
          'didInvalidate',
        ),
      hasSucceeded: state =>
        checkKeyForResourceOrId(
          getState(state),
          resourceName,
          actionName,
          'hasSucceeded',
        ),
      hasFailed: state =>
        checkKeyForResourceOrId(
          getState(state),
          resourceName,
          actionName,
          'hasFailed',
        ),
      couldPerformOnId: (state, resourceId) =>
        !isPerformingOnResourceOrId(
          getState(state),
          resourceName,
          actionName,
          resourceId,
        ),
      isPerformingOnId: (state, resourceId) =>
        isPerformingOnResourceOrId(
          getState(state),
          resourceName,
          actionName,
          resourceId,
        ),
      hasSucceededOnId: (state, resourceId) =>
        checkKeyForResourceOrId(
          getState(state),
          resourceName,
          actionName,
          'hasSucceeded',
          resourceId,
        ),
      hasFailedOnId: (state, resourceId) =>
        checkKeyForResourceOrId(
          getState(state),
          resourceName,
          actionName,
          'hasFailed',
          resourceId,
        ),
      isValidId: (state, resourceId) =>
        !checkKeyForResourceOrId(
          getState(state),
          resourceName,
          actionName,
          'didInvalidate',
          resourceId,
        ),
    },
    request: {
      getResource: (state, ownProps, applyDenormalizer = true) =>
        getRequestResource(
          getState(state),
          resourceName,
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
          applyDenormalizer,
          denormalizer,
        ),
      getMetadata: (state, ownProps) =>
        getRequestMetadata(
          getState(state),
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
        ),
      couldPerform: (state, ownProps) =>
        !isPerformingRequest(
          getState(state),
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
        ),
      isPerforming: (state, ownProps) =>
        isPerformingRequest(
          getState(state),
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
        ),
      isValid: (state, ownProps) =>
        !checkKeyForRequest(
          getState(state),
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
          'didInvalidate',
        ),
      hasSucceeded: (state, ownProps) =>
        checkKeyForRequest(
          getState(state),
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
          'hasSucceeded',
        ),
      hasFailed: (state, ownProps) =>
        checkKeyForRequest(
          getState(state),
          getNormalizedURLFromOwnProps(resourceName, actionName, ownProps),
          'hasFailed',
        ),
    },
  },
});

export default generateActionSelectors;
