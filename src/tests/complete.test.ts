import { BIG_SORT_NUMBER } from '@/constants/variables';
import { extractTestCasesFromFile } from '../extractTestCasesFromFile';

const stringSend: string = 'string send';

describe('Should test e2e application', () => {
  it('should return expected response', () => {
    expect(
      extractTestCasesFromFile({
        textFileTest: `
describe('Name suit test', () => {
  /* doc: Title suit test */

  it(" [doc]  - Name from test", async () => {
    /* doc: Description from test */

    const limit = 10;
    const response = await request.post('/user?limit=\${limit}').send('string send').set({
      Authorization: 'Bearer'
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('example return string body');
  });

  test('[doc]:Name from test 2', async () => {
    /* doc: Title Suit test 2 */
    const userId = 123
    const reverseTrue = true

    const response = await request.delete(\`/user/\${userId}?reverse=\${reverseTrue}\`).send({id: 1}).set({
      Authorization: "Bearer 2"
    });

    expect(response.body).toEqual({message: "success"});
    expect(response.statusCode).toEqual(200);
  });

  it("[docs]: Name test dev", async () => {
    const response = await request.get('/user').send('string send')

    expect(response.statusCode).toEqual(300);
  });
});
                  `,
        directoryAllTests: '../',
      }),
    ).toEqual({
      cases: [
        {
          method: 'post',
          sendContent: stringSend,
          parameters: [
            {
              example: 10,
              in: 'query',
              name: 'limit',
              type: 'number',
              variable: 'limit',
            },
          ],
          title: 'Name from test',
          description: 'Description from test',
          path: '/user',
          headers: {
            Authorization: 'Bearer',
          },
          response: {
            statusCode: 200,
            body: 'example return string body',
          },
        },
        {
          method: 'delete',
          sendContent: { id: 1 },
          parameters: [
            {
              example: 123,
              name: 'userId',
              type: 'number',
              in: 'param',
              variable: 'userId',
            },
            {
              example: true,
              name: 'reverse',
              type: 'boolean',
              in: 'query',
              variable: 'reverseTrue',
            },
          ],
          title: 'Name from test 2',
          description: 'Title Suit test 2',
          path: '/user/${userId}',
          headers: {
            Authorization: 'Bearer 2',
          },
          response: {
            statusCode: 200,
            body: { message: 'success' },
          },
        },
      ],
      order: BIG_SORT_NUMBER,
      title: 'Name suit test',
      description: 'Title suit test',
    });
  });

  it('should return expected response', () => {
    expect(
      extractTestCasesFromFile({
        textFileTest: `
describe('Name suit test', () => {
  it("[doc] - Name from test", async () => {
    const response = await request.post('/user').send('string send')

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('example return string body');
  });

  it("[doc] - Name test dev", async () => {
    const response = await request.get('/user').send('string send')

    expect(response.statusCode).toEqual(300);
  });
});
        `,
        directoryAllTests: '../',
      }),
    ).toEqual({
      cases: [
        {
          method: 'post',
          sendContent: stringSend,
          parameters: [],
          title: 'Name from test',
          description: '',
          path: '/user',
          headers: '',
          response: {
            statusCode: 200,
            body: 'example return string body',
          },
        },
        {
          method: 'get',
          sendContent: stringSend,
          parameters: [],
          title: 'Name test dev',
          description: '',
          path: '/user',
          headers: '',
          response: {
            statusCode: 300,
            body: {},
          },
        },
      ],
      order: BIG_SORT_NUMBER,
      title: 'Name suit test',
      description: '',
    });
  });
});
