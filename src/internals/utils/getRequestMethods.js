import { getNetworkHelpers } from '../network/networkHelpers';

const getRequestMethods = () => {
  const {
    requestDELETE,
    requestGET,
    requestPATCH,
    requestPOST,
    requestPUT,
  } = getNetworkHelpers();

  return {
    GET: requestGET,
    PATCH: requestPATCH,
    PUT: requestPUT,
    POST: requestPOST,
    DELETE: requestDELETE,
  };
};

export default getRequestMethods;
