const generateThunkAction = (actionType, resourceName) => normalizedURL => ({
  type: actionType,
  url: normalizedURL,
  resourceName,
});

export default generateThunkAction;
