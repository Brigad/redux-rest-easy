import isPlainObject from '../utils/isPlainObject';

const GLOBAL_PREFIX = 'redux-rest-easy:';

const getPrefixedThrowError = prefix => (error) => {
  throw new Error(`${GLOBAL_PREFIX} ${prefix} ${error}`);
};

const isString = value => typeof value === 'string';
const isFunction = value => typeof value === 'function';
const isDefined = value => value !== undefined;

const MANDATORY_KEYS = ['method', 'url'];
const OPTIONAL_KEYS = [
  'cacheHint',
  'beforeHook',
  'normalizer',
  'metadataNormalizer',
  'afterHook',
  'networkHelpers',
];
const VALID_KEYS = [...MANDATORY_KEYS, ...OPTIONAL_KEYS];
const VALID_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

const displayResourceName = resourceName => `${resourceName} >`;
const displayActionName = actionName => `${actionName} >`;
const displayFunctionName = () => 'createResource >';

const noConfigError = () =>
  `You have to provide a valid actions configuration.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource.md#createresourceresourcename-optionsactions`;

const missingMandatoryKeyError = mandatoryKEY =>
  `Key "${mandatoryKEY}" is missing.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

const unknownKeyError = actionKey => `Unknown key "${actionKey}".

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

const invalidMethodError = method =>
  `Method "${method}" is invalid. Expected one of: ${VALID_METHODS.join(', ')}.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

const invalidURLError = url => `URL "${url}" is invalid. Expected a string or a function returning a string.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

const invalidFunctionError = (func, value) =>
  `${func} "${value}" is invalid. Expected a valid function.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

const invalidObjectError = (func, value) =>
  `${func} "${value}" is invalid. Expected a valid object.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

const invalidNetworkHelperError = (func, value) =>
  `${func} "networkHelpers.${value}" is invalid. Expected a valid function.

For more information, browse the related documentation: https://github.com/Brigad/redux-rest-easy/blob/master/docs/api/createResource/actionsConfig.md#actionsconfig`;

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

    const {
      method,
      url,
      cacheHint,
      beforeHook,
      normalizer,
      metadataNormalizer,
      afterHook,
      networkHelpers,
    } = action;

    if (!isString(method) || !VALID_METHODS.includes(method)) {
      throwError(invalidMethodError(method));
    }
    if (!url || (!isString(url) && !isFunction(url))) {
      throwError(invalidURLError(url));
    }
    if (isDefined(cacheHint) && !isFunction(cacheHint)) {
      throwError(invalidFunctionError('cacheHint', cacheHint));
    }
    if (isDefined(beforeHook) && !isFunction(beforeHook)) {
      throwError(invalidFunctionError('beforeHook', beforeHook));
    }
    if (isDefined(normalizer) && !isFunction(normalizer)) {
      throwError(invalidFunctionError('normalizer', normalizer));
    }
    if (isDefined(metadataNormalizer) && !isFunction(metadataNormalizer)) {
      throwError(
        invalidFunctionError('metadataNormalizer', metadataNormalizer),
      );
    }
    if (isDefined(afterHook) && !isFunction(afterHook)) {
      throwError(invalidFunctionError('afterHook', afterHook));
    }
    if (isDefined(networkHelpers) && !isPlainObject(networkHelpers)) {
      throwError(invalidObjectError('networkHelpers', networkHelpers));
    }

    Object.keys(networkHelpers || {}).forEach((networkHelper) => {
      if (
        isDefined(networkHelpers[networkHelper])
        && !isFunction(networkHelpers[networkHelper])
      ) {
        throwError(
          invalidNetworkHelperError(
            networkHelper,
            networkHelpers[networkHelper],
          ),
        );
      }
    });
  });
};

export default checkActionsConfig;
