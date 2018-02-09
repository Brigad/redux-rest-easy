import isPlainObject from 'lodash.isplainobject';
import mergeWith from 'lodash.mergewith';

const shallowMergeResources = (state, normalizedPayload) =>
  mergeWith(
    state.resources,
    normalizedPayload,
    (resources, newResources) =>
      isPlainObject(resources) ? { ...resources, ...newResources } : undefined,
  );

export default shallowMergeResources;
