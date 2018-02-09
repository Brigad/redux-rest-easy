import getResourceIdFromNormalizedURL from '../../../src/internals/utils/getResourceIdFromNormalizedURL';

describe('getResourceIdFromNormalizedURL', () => {
  test('invalid arguments', () => {
    expect(getResourceIdFromNormalizedURL()).toBeNull();
    expect(getResourceIdFromNormalizedURL('')).toBeNull();
    expect(getResourceIdFromNormalizedURL('URL')).toBeNull();
    expect(getResourceIdFromNormalizedURL('', 1)).toBeNull();
    expect(getResourceIdFromNormalizedURL('URL', -1)).toBeNull();
  });

  test('happy path', () => {
    const id = '12';
    const subId = '20';

    expect(
      getResourceIdFromNormalizedURL(`https://api.co/fruits/${id}`, 4),
    ).toBe(id);
    expect(
      getResourceIdFromNormalizedURL(`https://api.co/fruits/${id}/eat`, 4),
    ).toBe(id);
    expect(
      getResourceIdFromNormalizedURL(
        `https://api.co/fruits/${id}/subfruit/${subId}`,
        6,
      ),
    ).toBe(subId);
    expect(
      getResourceIdFromNormalizedURL(
        `https://api.co/fruits/${id}/subfruit/${subId}/yum`,
        6,
      ),
    ).toBe(subId);
  });
});
