import generateThunk from '../action-creator/generateThunk';
import generateThunkAction from './generateThunkActions/generateThunkAction';
import generateThunkActionTypes from './generateThunkActions/generateThunkActionTypes';

const generateThunkActions = (
  resourceName,
  cacheLifetime,
  actionsConfig,
  actionName,
) => {
  const { INVALIDATE_REQUEST } = generateThunkActionTypes(resourceName);

  return {
    [actionName]: {
      perform: generateThunk(
        resourceName,
        cacheLifetime,
        actionsConfig,
        actionName,
      ),
      invalidate: generateThunkAction(INVALIDATE_REQUEST, resourceName),
    },
  };
};

export default generateThunkActions;
