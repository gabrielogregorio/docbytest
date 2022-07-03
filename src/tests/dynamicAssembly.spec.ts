import { mergeRecursive } from '../helpers/mergeRecursive';
import { dynamicAssembly } from '../helpers/dynamicAssembly';
import { getFirstKeyObject } from '../helpers/getFirstKeyObject';

describe('Dynamic assembly', () => {
  it('should mount dynamic payload', () => {
    const transform1 = dynamicAssembly('body.message.name.age', '"25 years"');
    let response = JSON.parse(transform1);

    const transform2 = dynamicAssembly('body.anyItem.magic', true);
    response = mergeRecursive(response, JSON.parse(transform2));

    const transform3 = dynamicAssembly('body.walking[1].validate', 99);
    response = mergeRecursive(response, JSON.parse(transform3));

    const transform4 = dynamicAssembly('body.walking[0].agency', false);
    response = mergeRecursive(response, JSON.parse(transform4));

    const transform5 = dynamicAssembly('body.walking[2].agency', '"apple"');
    response = mergeRecursive(response, JSON.parse(transform5));

    const transform6 = dynamicAssembly('body.walking[0].agency', true);
    response = mergeRecursive(response, JSON.parse(transform6));

    const transform7 = dynamicAssembly('body.walking[0].anyTestItem.id', 1234);
    response = mergeRecursive(response, JSON.parse(transform7));

    const transform8 = dynamicAssembly('body.walking[0].running[1].id', '"running"');
    response = mergeRecursive(response, JSON.parse(transform8));

    const transform9 = dynamicAssembly('body.walking[0].running[1].test[2]', false);
    response = mergeRecursive(response, JSON.parse(transform9));

    const transform10 = dynamicAssembly('body.city[1].computer[1]', [
      1,
      '2',
      {
        the: 'start',
      },
    ]);
    response = mergeRecursive(response, JSON.parse(transform10));

    const transform11 = dynamicAssembly('body.city[0]', { otherItem: 'valueOther' });
    response = mergeRecursive(response, JSON.parse(transform11));

    const responseInside = getFirstKeyObject(response);

    expect(responseInside).toEqual({
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

  it('should mount dynamic payload with start list', () => {
    const transform1 = dynamicAssembly('body[0].name', '"lucas"');
    let response = JSON.parse(transform1);

    const transform2 = dynamicAssembly('body[0].age', 22);
    response = mergeRecursive(response, JSON.parse(transform2));

    const transform3 = dynamicAssembly('body[2].name', '"talita"');
    response = mergeRecursive(response, JSON.parse(transform3));

    const transform4 = dynamicAssembly('body[2].age', 21);
    response = mergeRecursive(response, JSON.parse(transform4));

    const transform5 = dynamicAssembly('body[2].movies[1].name', '"best"');
    response = mergeRecursive(response, JSON.parse(transform5));

    const responseInside = getFirstKeyObject(response);

    expect(responseInside).toEqual([
      { name: 'lucas', age: 22 },
      undefined,
      { name: 'talita', age: 21, movies: [null, { name: 'best' }] },
    ]);
  });
});
