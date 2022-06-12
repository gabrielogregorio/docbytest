import { extractDataFromText } from '../extractDataFromTests';

describe('Should test e2e application', () => {
  it('should return expected response', () => {
    expect(
      extractDataFromText(`
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
});
        `),
    ).toEqual({
      cases: [
        {
          method: 'post',
          sendContent: 'string send',
          params: [
            {
              example: 10,
              in: 'query',
              required: null,
              tag: 'limit',
              type: 'number',
              variable: 'limit',
            },
          ],
          title: 'Name from test',
          description: 'Description from test',
          fullPath: '/user',
          router: '/user?limit=${limit}',
          headers: {
            Authorization: 'Bearer',
          },
          response: {
            statusCode: '200',
            body: 'example return string body',
          },
        },
        {
          method: 'delete',
          sendContent: { id: 1 },
          params: [
            {
              example: 123,
              tag: 'userId',
              type: 'number',
              in: 'param',
              required: null,
              variable: 'userId',
            },
            {
              example: true,
              tag: 'reverse',
              type: 'boolean',
              in: 'query',
              required: null,
              variable: 'reverseTrue',
            },
          ],
          title: 'Name from test 2',
          description: 'Title Suit test 2',
          fullPath: '/user/${userId}',
          router: '/user/${userId}?reverse=${reverseTrue}',
          headers: {
            Authorization: 'Bearer 2',
          },
          response: {
            statusCode: '200',
            body: { message: 'success' },
          },
        },
      ],
      title: 'Name suit test',
      description: 'Title suit test',
    });
  });
});
