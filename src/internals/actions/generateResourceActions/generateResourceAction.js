const generateResourceAction = (actionType, resourceName) => resourceId => ({
  type: actionType,
  resourceName,
  resourceId,
});

export default generateResourceAction;
