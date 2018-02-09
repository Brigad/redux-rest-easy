import generateGlobalAction from './generateGlobalActions/generateGlobalAction';
import generateGlobalActionTypes from './generateGlobalActions/generateGlobalActionTypes';

const generateGlobalActions = () => {
  const { RESET_ALL } = generateGlobalActionTypes();

  return {
    resetAll: generateGlobalAction(RESET_ALL),
  };
};

export default generateGlobalActions;
