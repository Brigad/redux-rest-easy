const getResourceIdFromNormalizedURL = (normalizedURL, idSplitIndex) => {
  if (
    !normalizedURL
    || (!idSplitIndex && idSplitIndex !== 0)
    || idSplitIndex === -1
  ) {
    return null;
  }

  let index = 0;

  for (let i = 0; i < idSplitIndex; i += 1) {
    index = normalizedURL.indexOf('/', index + 1);
  }

  const nextSeparatorIndex = normalizedURL.indexOf('/', index + 1);

  return normalizedURL.substr(
    index + 1,
    nextSeparatorIndex !== -1
      ? nextSeparatorIndex - index - 1
      : normalizedURL.length,
  );
};

export default getResourceIdFromNormalizedURL;
