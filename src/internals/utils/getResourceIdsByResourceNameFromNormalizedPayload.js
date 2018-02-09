const getResourceIdsByResourceNameFromNormalizedPayload = (
  principalResourceName,
  normalizedPayload,
  principalResourceIds,
) =>
  normalizedPayload
    ? Object.keys(normalizedPayload).reduce(
        (resourceIdsByResourceName, resourceName) => ({
          ...resourceIdsByResourceName,
          [resourceName]:
            resourceName === principalResourceName
              ? principalResourceIds
              : Object.keys(normalizedPayload[resourceName] || {}),
        }),
        {},
      )
    : {};

export default getResourceIdsByResourceNameFromNormalizedPayload;
