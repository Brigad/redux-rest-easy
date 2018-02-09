import generateActionType from '../../utils/generateActionType';

const generateThunkActionTypes = resourceName => ({
  INVALIDATE_REQUEST: generateActionType(
    resourceName,
    '@invalidate',
    'INVALIDATE_REQUEST',
  ),
});

export default generateThunkActionTypes;
