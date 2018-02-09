const getIdSplitIndexFromURL = (url) => {
  const URL = typeof url !== 'string' ? url() : url;

  const reversedSplitURL = URL.split('/').reverse();
  const reversedIndex = reversedSplitURL.findIndex(component =>
    component.startsWith('::'),
  );

  return reversedIndex !== -1
    ? reversedSplitURL.length - 1 - reversedIndex
    : -1;
};

export default getIdSplitIndexFromURL;
