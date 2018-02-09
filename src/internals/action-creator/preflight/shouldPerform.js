const shouldPerform = (state, normalizedURL) =>
  !state
  || !normalizedURL
  || !state.requests
  || !state.requests[normalizedURL]
  || !!state.requests[normalizedURL].endedAt;

export default shouldPerform;
