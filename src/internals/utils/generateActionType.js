const generateActionType = (resourceName, actionName, step) =>
  `@@rest-easy/${resourceName}/${actionName}/${step.toUpperCase()}`;

export default generateActionType;
