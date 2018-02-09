const generateGlobalAction = actionType => () => ({
  type: actionType,
});

export default generateGlobalAction;
