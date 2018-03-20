import mockdate from 'mockdate';
import moment from 'moment';

import hasCacheExpired from '../../../src/internals/utils/hasCacheExpired';

const MOMENT_NOW = moment(Date.UTC(2017, 0, 1));
const EXPIRE_AT_NOW = new Date(Date.UTC(2017, 0, 1)).toISOString();
const EXPIRE_AT_ONE_SEC = new Date(
  Date.UTC(2017, 0, 1) + 1 * 1000,
).toISOString();
const EXPIRE_AT_NEVER = 'never';

describe('hasCacheExpired', () => {
  test('cacheLifetime = 0', () => {
    mockdate.set(MOMENT_NOW);
    expect(hasCacheExpired(EXPIRE_AT_NOW, 0)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_NOW, 0)).toBe(true);
  });

  test('cacheLifetime = 1', () => {
    mockdate.set(MOMENT_NOW);
    expect(hasCacheExpired(EXPIRE_AT_ONE_SEC)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_ONE_SEC)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_ONE_SEC)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_ONE_SEC)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_ONE_SEC)).toBe(true);
  });

  test('cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_NOW);
    expect(hasCacheExpired(EXPIRE_AT_NEVER)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_NEVER)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(999, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_NEVER)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1000, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_NEVER)).toBe(false);

    mockdate.set(moment(MOMENT_NOW).add(1001, 'milliseconds'));
    expect(hasCacheExpired(EXPIRE_AT_NEVER)).toBe(false);
  });
});
