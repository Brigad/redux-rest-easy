import stringifyQueryParameters from './stringifyQueryParameters';

const normalizeURL = (actionName, formattedURL, cacheHint) =>
  `${actionName || ''}${formattedURL ? `:${formattedURL}` : ''}${
    cacheHint ? `:${stringifyQueryParameters(cacheHint)}` : ''
  }`;

export default normalizeURL;
