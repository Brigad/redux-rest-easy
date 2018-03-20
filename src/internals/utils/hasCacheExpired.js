const hasCacheExpired = expireAt =>
  expireAt !== 'never' && (!expireAt || new Date() > new Date(expireAt));

export default hasCacheExpired;
