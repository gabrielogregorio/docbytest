import { mergeRecursive } from '../helpers/mergeRecursive';
import { dynamicAssembly } from '../helpers/dynamicAssembly';

describe('Dynamic assembly', () => {
  it('should mount dynamic payload', () => {
    const transform1 = dynamicAssembly('response.message.name.age', '"25 years"');
    let response = mergeRecursive({}, JSON.parse(transform1));

    const transform2 = dynamicAssembly('response.anyItem.magic', true);
    response = mergeRecursive(response, JSON.parse(transform2));

    const transform3 = dynamicAssembly('response.walking[1].validate', 99);
    response = mergeRecursive(response, JSON.parse(transform3));

    const transform4 = dynamicAssembly('response.walking[0].agency', false);
    response = mergeRecursive(response, JSON.parse(transform4));

    const transform5 = dynamicAssembly('response.walking[2].agency', '"apple"');
    response = mergeRecursive(response, JSON.parse(transform5));

    const transform6 = dynamicAssembly('response.walking[0].agency', true);
    response = mergeRecursive(response, JSON.parse(transform6));

    const transform7 = dynamicAssembly('response.walking[0].anyTestItem.id', 1234);
    response = mergeRecursive(response, JSON.parse(transform7));

    const transform8 = dynamicAssembly('response.walking[0].running[1].id', '"running"');
    response = mergeRecursive(response, JSON.parse(transform8));

    const transform9 = dynamicAssembly('response.walking[0].running[1].test[2]', false);
    response = mergeRecursive(response, JSON.parse(transform9));

    const transform10 = dynamicAssembly('response.city[1].computer[1]', [
      1,
      '2',
      {
        the: 'start',
      },
    ]);
    response = mergeRecursive(response, JSON.parse(transform10));

    const transform11 = dynamicAssembly('response.city[0]', { otherItem: 'valueOther' });
    response = mergeRecursive(response, JSON.parse(transform11));

    expect(response).toEqual({
      message: { name: { age: '25 years' } },
      anyItem: { magic: true },
      city: [
        {
          otherItem: 'valueOther',
        },
        {
          computer: [
            null,
            [
              1,
              '2',
              {
                the: 'start',
              },
            ],
          ],
        },
      ],
      walking: [
        { agency: true, running: [null, { id: 'running', test: [null, null, false] }], anyTestItem: { id: 1234 } },
        { validate: 99 },
        { agency: 'apple' },
      ],
    });
  });
});
