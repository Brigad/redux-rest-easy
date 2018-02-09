import generateResourceActions from './internals/actions/generateResourceActions';
import generateThunkActions from './internals/actions/generateThunkActions';
import checkActionsConfig from './internals/config/checkActionsConfig';
import checkResourceConfig from './internals/config/checkResourceConfig';
import generateActionSelectors from './internals/selectors/generateActionSelectors';
import generateResourceSelectors from './internals/selectors/generateResourceSelectors';

const createResource = (resourceName, resourceConfig) => (actionsConfig) => {
  checkResourceConfig(resourceName, resourceConfig);
  checkActionsConfig(resourceName, actionsConfig);

  const { cacheLifetime = 0, denormalizer } = resourceConfig || {};

  let actions = {
    ...generateResourceActions(resourceName),
  };
  let selectors = {
    ...generateResourceSelectors(resourceName, denormalizer),
  };

  Object.keys(actionsConfig || {}).forEach((actionName) => {
    actions = {
      ...actions,
      ...generateThunkActions(
        resourceName,
        cacheLifetime,
        actionsConfig || {},
        actionName,
      ),
    };
    selectors = {
      ...selectors,
      ...generateActionSelectors(resourceName, actionName, denormalizer),
    };
  });

  return {
    actions,
    selectors,
  };
};

export default createResource;
