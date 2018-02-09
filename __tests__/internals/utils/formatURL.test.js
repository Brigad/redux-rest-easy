import formatURL from '../../../src/internals/utils/formatURL';

const QUERY = {
  fresh: true,
  hunger: 3,
};

const URL_PARAMS = {
  subId: 20,
  id: '12',
  nonExistingParam: 'hey',
};

describe('formatURL', () => {
  test('no url params, no query', () => {
    expect(formatURL('https://api.co/fruits')).toBe('https://api.co/fruits');
  });

  test('no url params', () => {
    expect(formatURL('https://api.co/fruits', null, QUERY)).toBe(
      'https://api.co/fruits?fresh=true&hunger=3',
    );
  });

  test('no query, string url', () => {
    expect(
      formatURL('https://api.co/fruits/:id/subfruits/::subId', URL_PARAMS),
    ).toBe('https://api.co/fruits/12/subfruits/20');
  });

  test('no query, func url', () => {
    expect(
      formatURL(
        () => 'https://api.co/fruits/:id/subfruits/::subId',
        URL_PARAMS,
      ),
    ).toBe('https://api.co/fruits/12/subfruits/20');
  });

  test('url params and query', () => {
    expect(
      formatURL(
        'https://api.co/fruits/:id/subfruits/::subId',
        URL_PARAMS,
        QUERY,
      ),
    ).toBe('https://api.co/fruits/12/subfruits/20?fresh=true&hunger=3');
  });
});
