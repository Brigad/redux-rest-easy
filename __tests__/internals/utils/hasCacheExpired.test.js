import mockdate from 'mockdate';
import moment from 'moment';

import hasCacheExpired from '../../../src/internals/utils/hasCacheExpired';

const MOMENT_END_DATE = moment(Date.UTC(2017, 0, 1));
const END_DATE = new Date(Date.UTC(2017, 0, 1)).toISOString();

describe('hasCacheExpired', () => {
  test('cacheLifetime = 0', () => {
    mockdate.set(MOMENT_END_DATE);
    expect(hasCacheExpired(END_DATE, 0)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, 0)).toBe(true);
  });

  test('cacheLifetime = 1', () => {
    mockdate.set(MOMENT_END_DATE);
    expect(hasCacheExpired(END_DATE, 1)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, 1)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(999, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, 1)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1000, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, 1)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1001, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, 1)).toBe(true);
  });

  test('cacheLifetime = Infinity', () => {
    mockdate.set(MOMENT_END_DATE);
    expect(hasCacheExpired(END_DATE, Infinity)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, Infinity)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(999, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, Infinity)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1000, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, Infinity)).toBe(false);

    mockdate.set(moment(MOMENT_END_DATE).add(1001, 'milliseconds'));
    expect(hasCacheExpired(END_DATE, Infinity)).toBe(false);
  });
});
