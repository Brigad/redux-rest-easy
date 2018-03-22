import getRestEasyState from '../../utils/getState';
import safeCall from '../../utils/safeCall';

import { getNetworkHelpers } from '../../network/networkHelpers';

const generateActionCreator = (
  actionName,
  actionCreatorActions,
  method,
  beforeHook,
  normalizer,
  afterHook,
  networkHelpers,
) => (formattedURL, normalizedURL, resourceId) => ({
  query = {},
  body = {},
  urlParams = {},
  onSuccess,
  onError,
  ...otherArgs
} = {}) => async (dispatch, getState) => {
  const combinedNetworkHelpers = {
    ...getNetworkHelpers(),
    ...(networkHelpers || {}),
  };

  dispatch(actionCreatorActions.REQUEST(normalizedURL, resourceId));

  try {
    const beforeHookReturn = await safeCall(
      beforeHook,
      urlParams,
      query,
      body,
      otherArgs,
      dispatch,
    );
    const finalBody = beforeHookReturn || body;

    const res = await fetch(
      formattedURL,
      (await combinedNetworkHelpers[`request${method}`](finalBody)),
    );
    combinedNetworkHelpers.handleStatusCode(res);
    const data = res.status !== 204 ? await res.json() : {};
    const {
      entities: normalizedPayload,
      result: principalResourceIds,
    } = normalizer
      ? normalizer(
          data,
          getRestEasyState(getState()).resources,
          urlParams,
          query,
          finalBody,
          otherArgs,
        )
      : { entities: data };

    const principalResourceIdsArray = Array.isArray(principalResourceIds)
      ? principalResourceIds
      : [principalResourceIds];

    dispatch(
      actionCreatorActions.RECEIVE(
        normalizedURL,
        resourceId,
        normalizedPayload,
        principalResourceIdsArray,
      ),
    );

    await safeCall(
      afterHook,
      normalizedPayload || {},
      urlParams,
      query,
      finalBody,
      otherArgs,
      dispatch,
    );
    safeCall(onSuccess, normalizedPayload || {}, otherArgs);
    return { normalizedPayload: normalizedPayload || {}, otherArgs };
  } catch (error) {
    dispatch(actionCreatorActions.FAIL(normalizedURL, resourceId));

    combinedNetworkHelpers.handleError(error, dispatch);
    safeCall(onError, error);
    return { error };
  }
};

export default generateActionCreator;
