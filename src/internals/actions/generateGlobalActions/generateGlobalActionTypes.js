import generateActionType from '../../utils/generateActionType';

const generateGlobalActionTypes = () => ({
  RESET_ALL: generateActionType('@global', '@reset', 'RESET_ALL'),
});

export default generateGlobalActionTypes;
