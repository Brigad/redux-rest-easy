import isPlainObject from './isPlainObject';

const mergeResources = (state, normalizedPayload) => {
  const initialResources = state && state.resources ? state.resources : {};

  if (!normalizedPayload || !isPlainObject(normalizedPayload)) {
    return initialResources;
  }

  return Object.entries(normalizedPayload).reduce(
    (prev, [resourceName, resource]) => ({
      ...prev,
      [resourceName]: {
        ...(initialResources[resourceName] || {}),
        ...resource,
      },
    }),
    initialResources,
  );
};

export default mergeResources;
