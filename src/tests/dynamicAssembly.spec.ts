import { mergeRecursive } from '../helpers/mergeRecursive';
import { dynamicAssembly } from '../helpers/dynamicAssembly';
import { getFirstKeyObject } from '../helpers/getFirstKeyObject';
import { contentRequestType } from '../interfaces/extractData';

describe('Dynamic assembly', () => {
  it('should mount dynamic payload', () => {
    const transform1: string = dynamicAssembly('body.message.name.age', '"25 years"');
    let response: contentRequestType = JSON.parse(transform1);

    const transform2: string = dynamicAssembly('body.anyItem.magic', true);
    response = mergeRecursive(response, JSON.parse(transform2));

    const EXAMPLE_NUMBER: number = 99;
    const transform3: string = dynamicAssembly('body.walking[1].validate', EXAMPLE_NUMBER);
    response = mergeRecursive(response, JSON.parse(transform3));

    const transform4: string = dynamicAssembly('body.walking[0].agency', false);
    response = mergeRecursive(response, JSON.parse(transform4));

    const transform5: string = dynamicAssembly('body.walking[2].agency', '"apple"');
    response = mergeRecursive(response, JSON.parse(transform5));

    const transform6: string = dynamicAssembly('body.walking[0].agency', true);
    response = mergeRecursive(response, JSON.parse(transform6));

    const EXAMPLE_NUMBER2: number = 1234;
    const transform7: string = dynamicAssembly('body.walking[0].anyTestItem.id', EXAMPLE_NUMBER2);
    response = mergeRecursive(response, JSON.parse(transform7));

    const transform8: string = dynamicAssembly('body.walking[0].running[1].id', '"running"');
    response = mergeRecursive(response, JSON.parse(transform8));

    const transform9: string = dynamicAssembly('body.walking[0].running[1].test[2]', false);
    response = mergeRecursive(response, JSON.parse(transform9));

    const EXAMPLE_NUMBER3: number = 1;
    const transform10: string = dynamicAssembly('body.city[1].computer[1]', [
      EXAMPLE_NUMBER3,
      '2',
      {
        the: 'start',
      },
    ]);
    response = mergeRecursive(response, JSON.parse(transform10));

    const transform11: string = dynamicAssembly('body.city[0]', { otherItem: 'valueOther' });
    response = mergeRecursive(response, JSON.parse(transform11));

    const responseInside: contentRequestType = getFirstKeyObject(response);

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
              EXAMPLE_NUMBER3,
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
    const transform1: string = dynamicAssembly('body[0].name', '"lucas"');
    let response: contentRequestType = JSON.parse(transform1);

    const EXAMPLE_NUMBER4: number = 22;
    const transform2: string = dynamicAssembly('body[0].age', EXAMPLE_NUMBER4);
    response = mergeRecursive(response, JSON.parse(transform2));

    const transform3: string = dynamicAssembly('body[2].name', '"talita"');
    response = mergeRecursive(response, JSON.parse(transform3));

    const EXAMPLE_NUMBER5: number = 21;
    const transform4: string = dynamicAssembly('body[2].age', EXAMPLE_NUMBER5);
    response = mergeRecursive(response, JSON.parse(transform4));

    const transform5: string = dynamicAssembly('body[2].movies[1].name', '"best"');
    response = mergeRecursive(response, JSON.parse(transform5));

    const responseInside: contentRequestType = getFirstKeyObject(response);

    expect(responseInside).toEqual([
      { name: 'lucas', age: 22 },
      undefined,
      { name: 'talita', age: 21, movies: [null, { name: 'best' }] },
    ]);
  });
});
