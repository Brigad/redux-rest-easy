import createCachedSelector from 're-reselect';

import getReReselectOptions from '../utils/getReReselectOptions';
import getState from '../utils/getState';
import {
  getEmptyResourceHash,
  getResourceHash,
  getResourcesHash,
} from '../utils/resolversHashes';

const EMPTY_RESOURCE = [];
const EMPTY_RESOURCE_ID = null;

const resourcesSelector = state => state.resources;

const resourceSelector = (state, resourceName) =>
  state.resources && state.resources[resourceName]
    ? state.resources[resourceName]
    : null;

const applyDenormalizerSelector = (state, resourceName, applyDenormalizer) =>
  applyDenormalizer;

const denormalizerSelector = (
  state,
  resourceName,
  applyDenormalizer,
  denormalizer,
) => denormalizer;

const getResourceSelector = (
  resources,
  resource,
  applyDenormalizer,
  denormalizer,
) => {
  if (!resource) {
    return EMPTY_RESOURCE;
  }

  return !applyDenormalizer || !denormalizer
    ? Object.values(resource)
    : denormalizer(Object.keys(resource), resources);
};

const getResourceResolver = (
  state,
  resourceName,
  applyDenormalizer,
  denormalizer,
) => {
  const resource = resourceSelector(state, resourceName);

  if (resource) {
    return !applyDenormalizer || !denormalizer
      ? `${applyDenormalizer && !!denormalizer}-${getResourceHash(
          state,
          resourceName,
        )}`
      : `${applyDenormalizer && !!denormalizer}-${getResourcesHash(state)}`;
  }

  return getEmptyResourceHash();
};

const getResource = createCachedSelector(
  resourcesSelector,
  resourceSelector,
  applyDenormalizerSelector,
  denormalizerSelector,
  getResourceSelector,
)(getResourceResolver, getReReselectOptions());

const getResourceById = (
  state,
  resourceName,
  resourceId,
  applyDenormalizer,
  denormalizer,
) => {
  const resource
    = state.resources
    && state.resources[resourceName]
    && state.resources[resourceName][resourceId]
      ? state.resources[resourceName][resourceId]
      : EMPTY_RESOURCE_ID;

  if (!applyDenormalizer || !denormalizer || !resource) {
    return resource;
  }

  const resources = Object.entries(state.resources).reduce(
    (prev, [name, value]) => ({
      ...prev,
      [name]:
        name === resourceName
          ? {
              [resourceId]: resource,
            }
          : value,
    }),
    {},
  );

  return denormalizer([resourceId], resources)[0] || EMPTY_RESOURCE_ID;
};

const generateResourceSelectors = (resourceName, denormalizer) => ({
  resource: {
    getResource: (state, applyDenormalizer = true) =>
      getResource(
        getState(state),
        resourceName,
        applyDenormalizer,
        denormalizer,
      ),
    getResourceById: (state, resourceId, applyDenormalizer = true) =>
      getResourceById(
        getState(state),
        resourceName,
        resourceId,
        applyDenormalizer,
        denormalizer,
      ),
  },
});

export default generateResourceSelectors;
