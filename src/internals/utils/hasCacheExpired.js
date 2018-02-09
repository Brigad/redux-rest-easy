const hasCacheExpired = (endedAt, cacheLifetime) =>
  new Date() - new Date(endedAt) > cacheLifetime * 1000;

export default hasCacheExpired;
