import generateActionType from '../../utils/generateActionType';

const generateResourceActionTypes = resourceName => ({
  INVALIDATE_RESOURCE: generateActionType(
    resourceName,
    '@invalidate',
    'INVALIDATE_RESOURCE',
  ),
  INVALIDATE_ID: generateActionType(
    resourceName,
    '@invalidate',
    'INVALIDATE_ID',
  ),
  RESET_RESOURCE: generateActionType(resourceName, '@reset', 'RESET_RESOURCE'),
});

export default generateResourceActionTypes;
