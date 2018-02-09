const normalizeURL = (actionName, formattedURL) =>
  `${actionName || ''}:${formattedURL || ''}`;

export default normalizeURL;
