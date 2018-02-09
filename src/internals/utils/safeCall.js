const safeCall = (func, ...args) => {
  if (func && typeof func === 'function') {
    return func(...args);
  }

  return undefined;
};

export default safeCall;
