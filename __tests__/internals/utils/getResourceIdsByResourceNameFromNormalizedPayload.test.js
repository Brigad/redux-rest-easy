import getResourceIdsByResourceNameFromNormalizedPayload from '../../../src/internals/utils/getResourceIdsByResourceNameFromNormalizedPayload';

const PRINCIPAL_RESOURCE_NAME = 'fruits';

describe('getResourceIdsByResourceNameFromNormalizedPayload', () => {
  test('no resources', () => {
    expect(
      Object.keys(
        getResourceIdsByResourceNameFromNormalizedPayload(
          PRINCIPAL_RESOURCE_NAME,
          {},
        ),
      ).length,
    ).toBe(0);
  });

  test('empty resources', () => {
    const emptyResources = {
      fruits: {},
      vegetables: null,
    };

    const result = getResourceIdsByResourceNameFromNormalizedPayload(
      PRINCIPAL_RESOURCE_NAME,
      emptyResources,
      [],
    );

    expect(Object.keys(result).length).toBe(2);
    expect(result.fruits.length).toBe(0);
    expect(result.vegetables.length).toBe(0);
  });

  test('happy path', () => {
    const resources = {
      fruits: {
        1: {},
        2: {},
      },
      vegetables: {
        3: {},
        4: {},
      },
    };

    const result = getResourceIdsByResourceNameFromNormalizedPayload(
      PRINCIPAL_RESOURCE_NAME,
      resources,
      ['2', '1'],
    );

    expect(Object.keys(result).length).toBe(2);
    expect(result.fruits.length).toBe(2);
    expect(result.fruits[0]).toBe('2');
    expect(result.fruits[1]).toBe('1');
    expect(result.vegetables.length).toBe(2);
    expect(result.vegetables[0]).toBe('3');
    expect(result.vegetables[1]).toBe('4');
  });
});
