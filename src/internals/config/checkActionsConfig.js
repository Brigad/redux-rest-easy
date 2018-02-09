import isPlainObject from 'lodash.isplainobject';

const GLOBAL_PREFIX = 'redux-rest-easy:';

const getPrefixedThrowError = prefix => (error) => {
  throw new Error(`${GLOBAL_PREFIX} ${prefix} ${error}`);
};

const isString = value => typeof value === 'string';
const isFunction = value => typeof value === 'function';
const isDefined = value => value !== undefined;

const MANDATORY_KEYS = ['method', 'url'];
const OPTIONAL_KEYS = ['beforeHook', 'normalizer', 'afterHook'];
const VALID_KEYS = [...MANDATORY_KEYS, ...OPTIONAL_KEYS];
const VALID_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

const displayResourceName = resourceName => `${resourceName} >`;
const displayActionName = actionName => `${actionName} >`;
const displayFunctionName = () => 'createResource >';

const noConfigError = () =>
  'You have to provide a valid actions configuration.';
const missingMandatoryKeyError = mandatoryKEY =>
  `Key "${mandatoryKEY}" is missing.`;
const unknownKeyError = actionKey => `Unknown key "${actionKey}.`;
const invalidMethodError = method =>
  `Method "${method}" is invalid. Expected one of: ${VALID_METHODS.join(
    ', ',
  )}.`;
const invalidURLError = url => `URL "${url}" is invalid. Expected a valid URL.`;
const invalidFunctionError = (func, value) =>
  `${func} "${value}" is invalid. Expected a valid function.`;

const checkActionsConfig = (resourceName, actionsConfig) => {
  if (!actionsConfig) {
    return;
  }

  if (!isPlainObject(actionsConfig) || !Object.keys(actionsConfig).length) {
    const throwError = getPrefixedThrowError(
      `${displayResourceName(resourceName)} ${displayFunctionName()}`,
    );

    throwError(noConfigError());
  }

  Object.keys(actionsConfig).forEach((actionName) => {
    const throwError = getPrefixedThrowError(
      `${displayResourceName(resourceName)} ${displayActionName(
        actionName,
      )} ${displayFunctionName()}`,
    );

    const action = actionsConfig[actionName];
    const actionKeys = Object.keys(action);

    MANDATORY_KEYS.forEach((mandatoryKey) => {
      if (!actionKeys.includes(mandatoryKey)) {
        throwError(missingMandatoryKeyError(mandatoryKey));
      }
    });
    actionKeys.forEach((actionKey) => {
      if (!VALID_KEYS.includes(actionKey)) {
        throwError(unknownKeyError(actionKey));
      }
    });

    const { method, url, beforeHook, normalizer, afterHook } = action;

    if (!isString(method) || !VALID_METHODS.includes(method)) {
      throwError(invalidMethodError(method));
    }
    if (!url || (!isString(url) && !isFunction(url))) {
      throwError(invalidURLError(url));
    }
    if (isDefined(beforeHook) && !isFunction(beforeHook)) {
      throwError(invalidFunctionError('beforeHook', beforeHook));
    }
    if (isDefined(normalizer) && !isFunction(normalizer)) {
      throwError(invalidFunctionError('normalizer', normalizer));
    }
    if (isDefined(afterHook) && !isFunction(afterHook)) {
      throwError(invalidFunctionError('afterHook', afterHook));
    }
  });
};

export default checkActionsConfig;
