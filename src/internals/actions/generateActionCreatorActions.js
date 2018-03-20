import generateActionCreatorAction from './generateActionCreatorActions/generateActionCreatorAction';
import generateActionCreatorActionTypes from './generateActionCreatorActions/generateActionCreatorActionTypes';

const generateActionCreatorActions = (
  resourceName,
  actionName,
  cacheLifetime,
) => {
  const {
    REQUEST,
    RECEIVE,
    FAIL,
    RECEIVE_FROM_CACHE,
  } = generateActionCreatorActionTypes(resourceName, actionName);

  return {
    REQUEST: generateActionCreatorAction(cacheLifetime, REQUEST),
    RECEIVE: generateActionCreatorAction(cacheLifetime, RECEIVE),
    FAIL: generateActionCreatorAction(cacheLifetime, FAIL),
    RECEIVE_FROM_CACHE: generateActionCreatorAction(
      cacheLifetime,
      RECEIVE_FROM_CACHE,
    ),
  };
};

export default generateActionCreatorActions;
