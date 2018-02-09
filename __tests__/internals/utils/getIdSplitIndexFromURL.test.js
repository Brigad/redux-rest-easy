import getIdSplitIndexFromURL from '../../../src/internals/utils/getIdSplitIndexFromURL';

describe('getIdSplitIndexFromURL', () => {
  test('no url param', () => {
    expect(getIdSplitIndexFromURL('https://api.co/fruits')).toBe(-1);
  });

  test('one url param, string url', () => {
    expect(getIdSplitIndexFromURL('https://api.co/fruits/::id')).toBe(4);
    expect(getIdSplitIndexFromURL('https://api.co/fruits/::id/eat')).toBe(4);
  });

  test('one url param, func url', () => {
    expect(getIdSplitIndexFromURL(() => 'https://api.co/fruits/::id')).toBe(4);
    expect(getIdSplitIndexFromURL(() => 'https://api.co/fruits/::id/eat')).toBe(
      4,
    );
  });

  test('two url params', () => {
    expect(
      getIdSplitIndexFromURL('https://api.co/fruits/:id/subfruits/::subid'),
    ).toBe(6);
    expect(
      getIdSplitIndexFromURL('https://api.co/fruits/:id/subfruits/::subid/eat'),
    ).toBe(6);
  });
});
