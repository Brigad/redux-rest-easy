import isPlainObject from '../utils/isPlainObject';

const GLOBAL_PREFIX = 'redux-rest-easy:';

const getPrefixedThrowError = prefix => (error) => {
  throw new Error(`${GLOBAL_PREFIX} ${prefix} ${error}`);
};

const isString = value => typeof value === 'string';
const isNumber = value => typeof value === 'number';
const isFunction = value => typeof value === 'function';
const isDefined = value => value !== undefined;

const OPTIONAL_KEYS = ['cacheLifetime', 'denormalizer'];
const VALID_KEYS = OPTIONAL_KEYS;

const displayResourceName = resourceName => `${resourceName} >`;
const displayFunctionName = () => 'createResource >';

const noResourceNameError = () => 'You have to provide a valid resource name.';
const noConfigError = () =>
  'You have to provide a valid resource configuration (or not at all).';
const unknownKeyError = actionKey =>
  `Unknown key "${actionKey}" in resource config.`;
const invalidCacheLifetimeError = value =>
  `cacheLifetime "${value}" in resource config is invalid. Expected a number between 0 and Infinity.`;
const invalidFunctionError = (func, value) =>
  `${func} "${value}" in resource config is invalid. Expected a valid function.`;

const checkResourceConfig = (resourceName, resourceConfig) => {
  const throwError = getPrefixedThrowError(
    `${displayResourceName(
      resourceName || '[no resource name]',
    )} ${displayFunctionName()}`,
  );

  if (!resourceName || !isString(resourceName)) {
    throwError(noResourceNameError());
  }

  if (!resourceConfig) {
    return;
  }

  if (!isPlainObject(resourceConfig) || !Object.keys(resourceConfig).length) {
    throwError(noConfigError());
  }

  const resourceConfigKeys = Object.keys(resourceConfig);

  resourceConfigKeys.forEach((actionKey) => {
    if (!VALID_KEYS.includes(actionKey)) {
      throwError(unknownKeyError(actionKey));
    }
  });

  const { cacheLifetime, denormalizer } = resourceConfig;

  if (
    isDefined(cacheLifetime)
    && (!isNumber(cacheLifetime) || cacheLifetime < 0)
  ) {
    throwError(invalidCacheLifetimeError(cacheLifetime));
  }
  if (isDefined(denormalizer) && !isFunction(denormalizer)) {
    throwError(invalidFunctionError('denormalizer', denormalizer));
  }
};

export default checkResourceConfig;
