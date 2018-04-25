import checkActionsConfig from '../../../src/internals/config/checkActionsConfig';

const RESOURCE_NAME = 'fruits';

const VALID_ACTION_CONFIG_BASE = {
  method: 'GET',
  url: 'https://api.co/fruits/eat',
};

describe('checkActionsConfig', () => {
  test('invalid actionsConfig', () => {
    expect(() => checkActionsConfig(RESOURCE_NAME)).not.toThrow();
    expect(() => checkActionsConfig(RESOURCE_NAME, [])).toThrow();
    expect(() => checkActionsConfig(RESOURCE_NAME, {})).toThrow();
  });

  test('mandatory key missing', () => {
    const invalidConfig1 = {
      eat: {
        url: 'https://api.co/fruits/eat',
      },
    };

    const invalidConfig2 = {
      eat: {
        method: 'GET',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig1)).toThrow();
    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig2)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('unknown key', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        unknown: true,
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid method', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        method: 'test',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        method: 'POST',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid url', () => {
    const invalidConfig1 = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        url: 1,
      },
    };

    const invalidConfig2 = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        url: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig1)).toThrow();
    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig2)).toThrow();

    const validConfig1 = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        url: 'https://api.co/fruits/eat',
      },
    };

    const validConfig2 = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        url: () => 'https://api.co/fruits/eat',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig1)).not.toThrow();
    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig2)).not.toThrow();
  });

  test('invalid cacheHint', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        cacheHint: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        cacheHint: () => ({ cache: 'hint' }),
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid beforeHook', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        beforeHook: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        beforeHook: () => {},
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid normalizer', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        normalizer: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        normalizer: () => true,
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid normalizer', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        metadataNormalizer: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        metadataNormalizer: () => ({ meta: true }),
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid afterHook', () => {
    const invalidConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        afterHook: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        afterHook: () => true,
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });

  test('invalid networkHelpers', () => {
    const invalidConfig1 = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        networkHelpers: '',
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig1)).toThrow();

    const invalidConfig2 = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        networkHelpers: {
          getToken: 'customToken',
        },
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, invalidConfig2)).toThrow();

    const validConfig = {
      eat: {
        ...VALID_ACTION_CONFIG_BASE,
        networkHelpers: {
          getToken: () => 'customToken',
        },
      },
    };

    expect(() => checkActionsConfig(RESOURCE_NAME, validConfig)).not.toThrow();
  });
});
