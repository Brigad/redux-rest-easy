import jsonStableStringify from 'json-stable-stringify';

import stringifyQueryParameters from './stringifyQueryParameters';

const formatURL = (url, urlParams, query) => {
  let formattedURL = typeof url !== 'string' ? url() : url;

  if (urlParams) {
    Object.keys(urlParams).forEach((param) => {
      formattedURL = formattedURL
        .replace(`::${param}`, urlParams[param])
        .replace(`:${param}`, urlParams[param]);
    });
  }

  const queryString = query
    ? stringifyQueryParameters(JSON.parse(jsonStableStringify(query)))
    : '';

  return `${formattedURL}${queryString}`;
};

export default formatURL;
