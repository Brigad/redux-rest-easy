import generateActionType from '../../../src/internals/utils/generateActionType';

describe('generateActionType', () => {
  test('lowercase step name', () => {
    expect(generateActionType('fruits', 'eat', 'test')).toBe(
      '@@rest-easy/fruits/eat/TEST',
    );
  });

  test('uppercase step name', () => {
    expect(generateActionType('fruits', 'eat', 'TEST')).toBe(
      '@@rest-easy/fruits/eat/TEST',
    );
  });
});
