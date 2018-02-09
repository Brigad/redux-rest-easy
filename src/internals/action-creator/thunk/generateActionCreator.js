import getRequestMethods from '../../utils/getRequestMethods';
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
) => (formattedURL, normalizedURL, resourceId) => ({
  query = {},
  body = {},
  urlParams = {},
  onSuccess,
  onError,
  ...otherArgs
} = {}) => async (dispatch, getState) => {
  const { handleError, handleStatusCode } = getNetworkHelpers();

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
      getRequestMethods()[method](finalBody),
    );
    handleStatusCode(res);
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

    dispatch(
      actionCreatorActions.RECEIVE(
        normalizedURL,
        resourceId,
        normalizedPayload,
        principalResourceIds,
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

    handleError(error, dispatch);
    safeCall(onError, error);
    return { error };
  }
};

export default generateActionCreator;
