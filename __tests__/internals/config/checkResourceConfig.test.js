import checkResourceConfig from '../../../src/internals/config/checkResourceConfig';

const RESOURCE_NAME = 'fruits';

describe('checkResourceConfig', () => {
  test('invalid resourceName', () => {
    expect(() => checkResourceConfig()).toThrow();
    expect(() => checkResourceConfig(null)).toThrow();
    expect(() => checkResourceConfig([])).toThrow();
    expect(() => checkResourceConfig({})).toThrow();
  });

  test('invalid resourceConfig', () => {
    expect(() => checkResourceConfig(RESOURCE_NAME, [])).toThrow();
    expect(() => checkResourceConfig(RESOURCE_NAME, {})).toThrow();
  });

  test('unknown key', () => {
    const invalidConfig = {
      unknown: true,
    };

    expect(() => checkResourceConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    expect(() => checkResourceConfig(RESOURCE_NAME)).not.toThrow();
  });

  test('invalid cacheLifetime', () => {
    const invalidConfig1 = {
      cacheLifetime: '0',
    };

    const invalidConfig2 = {
      cacheLifetime: -1,
    };

    expect(() => checkResourceConfig(RESOURCE_NAME, invalidConfig1)).toThrow();
    expect(() => checkResourceConfig(RESOURCE_NAME, invalidConfig2)).toThrow();

    const validConfig = {
      cacheLifetime: 30,
    };

    expect(() => checkResourceConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid denormalizer', () => {
    const invalidConfig = {
      denormalizer: '',
    };

    expect(() => checkResourceConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      denormalizer: () => true,
    };

    expect(() => checkResourceConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });
});
