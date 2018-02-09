const getActionNameFromNormalizedURL = normalizedURL =>
  normalizedURL.split(':')[0];

export default getActionNameFromNormalizedURL;
