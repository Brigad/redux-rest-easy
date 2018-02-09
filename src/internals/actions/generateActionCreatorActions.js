import generateActionCreatorAction from './generateActionCreatorActions/generateActionCreatorAction';
import generateActionCreatorActionTypes from './generateActionCreatorActions/generateActionCreatorActionTypes';

const generateActionCreatorActions = (resourceName, actionName) => {
  const {
    REQUEST,
    RECEIVE,
    FAIL,
    RECEIVE_FROM_CACHE,
  } = generateActionCreatorActionTypes(resourceName, actionName);

  return {
    REQUEST: generateActionCreatorAction(REQUEST),
    RECEIVE: generateActionCreatorAction(RECEIVE),
    FAIL: generateActionCreatorAction(FAIL),
    RECEIVE_FROM_CACHE: generateActionCreatorAction(RECEIVE_FROM_CACHE),
  };
};

export default generateActionCreatorActions;
