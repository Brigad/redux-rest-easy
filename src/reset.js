import generateGlobalActions from './internals/actions/generateGlobalActions';

const reset = () => {
  const { resetAll } = generateGlobalActions();

  return resetAll();
};

export default reset;
