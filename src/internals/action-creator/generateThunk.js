import generateActionCreatorActions from '../actions/generateActionCreatorActions';
import formatURL from '../utils/formatURL';
import getIdSplitIndexFromURL from '../utils/getIdSplitIndexFromURL';
import getResourceIdFromNormalizedURL from '../utils/getResourceIdFromNormalizedURL';
import getRestEasyState from '../utils/getState';
import normalizeURL from '../utils/normalizeURL';
import isCacheExpired from './preflight/isCacheExpired';
import isSmartCacheAvailable from './preflight/isSmartCacheAvailable';
import shouldPerform from './preflight/shouldPerform';
import generateActionCreator from './thunk/generateActionCreator';

/* eslint-disable no-underscore-dangle */

const generateThunk = (
  resourceName,
  cacheLifetime,
  actionsConfig,
  actionName,
) => {
  const {
    method,
    url,
    cacheHint,
    beforeHook,
    normalizer,
    metadataNormalizer,
    afterHook,
    networkHelpers,
  } = actionsConfig[actionName];
  const actionCreatorActions = generateActionCreatorActions(
    resourceName,
    actionName,
    cacheLifetime,
  );
  const actionCreator = generateActionCreator(
    actionName,
    actionCreatorActions,
    method,
    beforeHook,
    normalizer,
    metadataNormalizer,
    afterHook,
    networkHelpers,
  );

  return args => (dispatch, getState) => {
    const state = getRestEasyState(getState());
    const { urlParams, query, body, otherArgs } = args || {};

    const idSplitIndex = getIdSplitIndexFromURL(url);
    const formattedURL = formatURL(url, urlParams, query);
    const cacheHintObject = cacheHint
      ? cacheHint(urlParams, query, body, otherArgs)
      : null;
    const normalizedURL = normalizeURL(
      actionName,
      formattedURL,
      cacheHintObject,
    );
    const resourceId = getResourceIdFromNormalizedURL(
      normalizedURL,
      idSplitIndex,
    );

    let action;

    if (shouldPerform(state, normalizedURL)) {
      if (isCacheExpired(state, method, normalizedURL)) {
        if (isSmartCacheAvailable(state, method, resourceName, resourceId)) {
          action = () =>
            dispatch(
              actionCreatorActions.RECEIVE_FROM_CACHE(
                normalizedURL,
                resourceId,
                {
                  [resourceName]: { [resourceId]: null },
                },
                null,
                [resourceId],
              ),
            );
        } else {
          action = () =>
            dispatch(
              actionCreator(formattedURL, normalizedURL, resourceId)(args),
            );
        }
      }
    }

    const thunk = action ? action() : {};

    thunk.__actionName = actionName;
    thunk.__requestURL = normalizedURL;

    return thunk;
  };
};

export default generateThunk;
