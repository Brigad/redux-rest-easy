import generateActionType from '../../utils/generateActionType';

const generateActionCreatorActionTypes = (resourceName, actionName) => ({
  REQUEST: generateActionType(resourceName, actionName, 'REQUEST'),
  RECEIVE: generateActionType(resourceName, actionName, 'RECEIVE'),
  FAIL: generateActionType(resourceName, actionName, 'FAIL'),
  RECEIVE_FROM_CACHE: generateActionType(
    resourceName,
    actionName,
    'RECEIVE_FROM_CACHE',
  ),
});

export default generateActionCreatorActionTypes;
