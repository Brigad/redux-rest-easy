import isObject from 'is-object';

const isPlainObject = arg => isObject(arg) && !Array.isArray(arg);

export default isPlainObject;
