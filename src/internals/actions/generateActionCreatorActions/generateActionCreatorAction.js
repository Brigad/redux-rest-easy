const generateActionCreatorAction = (cacheLifetime, actionType) => (
  normalizedURL,
  resourceId,
  normalizedPayload,
  metadata,
  principalResourceIds,
) => ({
  type: actionType,
  url: normalizedURL,
  resourceId,
  payload:
    normalizedPayload && Object.keys(normalizedPayload).length
      ? normalizedPayload
      : undefined,
  metadata,
  principalResourceIds:
    typeof principalResourceIds === 'string'
      ? [principalResourceIds]
      : principalResourceIds,
  cacheLifetime,
});

export default generateActionCreatorAction;
