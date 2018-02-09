import qs from 'qs';

const stringifyObject = (object) => {
  if (!object || !Object.keys(object)) {
    return '';
  }

  return qs.stringify(object);
};

const stringifyQueryParameters = (queryParameters) => {
  const stringified = stringifyObject(queryParameters);

  return stringified ? `?${stringified}` : '';
};

export default stringifyQueryParameters;
