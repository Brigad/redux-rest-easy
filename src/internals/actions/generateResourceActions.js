import generateResourceAction from './generateResourceActions/generateResourceAction';
import generateResourceActionTypes from './generateResourceActions/generateResourceActionTypes';

const generateResourceActions = (resourceName) => {
  const {
    INVALIDATE_RESOURCE,
    INVALIDATE_ID,
    RESET_RESOURCE,
  } = generateResourceActionTypes(resourceName);

  return {
    resource: {
      invalidate: generateResourceAction(INVALIDATE_RESOURCE, resourceName),
      invalidateId: generateResourceAction(INVALIDATE_ID, resourceName),
      reset: generateResourceAction(RESET_RESOURCE, resourceName),
    },
  };
};

export default generateResourceActions;
