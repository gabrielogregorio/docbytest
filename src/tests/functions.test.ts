import {
  getExpectedStatusCode,
  getExpectedResponse,
  getContentSend,
  getDescriptionLocal,
  getRouterRequest,
  getFullDescription,
  getSentHeader,
  getQueryParams,
  getUrlParams,
  getExpectedResponseDynamically,
} from '../helpers/helpers';

const usernameTest = 'Lucas Santos';

describe('Suite', () => {
  it('should return status code', () => {
    expect(getExpectedStatusCode('expect(response.statusCode)\n.toBe(200);')).toEqual(200);
    expect(getExpectedStatusCode('expect(res.statusCode).toBe(\n 301\n).toTest()')).toEqual(301);
    expect(getExpectedStatusCode('expect(res.statusCode).toBe( 500);')).toEqual(500);
    expect(getExpectedStatusCode('expect(response.statusCode).toEqual(403);')).toEqual(403);
  });

  it('should return expected response', () => {
    expect(
      getSentHeader(
        `
        const response = await requestDoc.post('/user').send('token').set({
          Authorization: '3'
        });
        `,
        '',
        '../',
      ),
    ).toEqual({
      Authorization: '3',
    });

    expect(
      getSentHeader(
        `
        const response = await requestDoc.post('/user')
        .send('token')
        .set({
          Authorization: '3',
          test: [
            {item: 123}
          ]
        });
        `,
        '',
        '../',
      ),
    ).toEqual({
      Authorization: '3',
      test: [{ item: 123 }],
    });

    expect(
      getSentHeader(
        `const response = await requestDoc.post('/user')
        .send('token')
        .set(dataToken);
        `,
        `

        const dataToken = {
          Authorization: '3',
          test: [
            {item: 123}
          ]
        };`,
        '../',
      ),
    ).toEqual({
      Authorization: '3',
      test: [{ item: 123 }],
    });
  });

  it('should return expected response', () => {
    expect(
      getExpectedResponse(
        `expect(response.body).toMatchObject(
          {
            userName: 'Lucas Santos',
            posts: [
              { Name: 'Julia',
              user_name: 'Santos'
            }]
          });`,
        '',
        '../',
      ),
    ).toEqual({ userName: usernameTest, posts: [{ Name: 'Julia', user_name: 'Santos' }] });

    expect(getExpectedResponse(`expect(res.body).toMatchObject({ userName: 'Lucas Santos' });`, '', '../')).toEqual({
      userName: usernameTest,
    });

    expect(
      getExpectedResponse(`expect(res__.body)\n.toMatchObject({\n\nuserName: 'Lucas Santos' });`, '', '../'),
    ).toEqual({
      userName: usernameTest,
    });

    expect(getExpectedResponse(`expect(res.body).toStrictEqual({ message: 'Error in data' });`, '', '../')).toEqual({
      message: 'Error in data',
    });

    expect(getExpectedResponse(`expect(res.body).toEqual({ message: 'Error in data' });`, '', '../')).toEqual({
      message: 'Error in data',
    });
  });

  it('should get send content', () => {
    expect(
      getContentSend(
        `const response = await request_doc.post(\`/post/comment/11111111\`)
        .set(token).send(
          {
            text: 'This is a comment',
            test: [
              123
            ]
          }
          );\n\n`,
        '',
        '../',
      ),
    ).toEqual({ text: 'This is a comment', test: [123] });

    expect(
      getContentSend(
        `
        const response = await requestDoc.post(\`/post/comment/\${variableId}\`)
        .set(token)
        .send({
          text: 'this response',
          replie: 190 });`,
        '',
        '../',
      ),
    ).toEqual({ text: 'this response', replie: 190 });

    expect(
      getContentSend(
        `\nconst response = await requestDoc.post(\`/post/comment/\${variableId}\`).set(
          token
          )
          .send('hi');`,
        '',
        '../',
      ),
    ).toEqual('hi');

    expect(
      getContentSend(
        `
        const response = await requestDoc
        .post('/user')
        .send({
          code: "codeGenerate",
          username: "usernameTest",
          itemSecret: "nameSecret"
        }
        );
      `,
        '',
        '../',
      ),
    ).toEqual({ code: 'codeGenerate', username: 'usernameTest', itemSecret: 'nameSecret' });

    expect(
      getContentSend(
        `
        const response = await requestDoc
        .post('/user')
        .send(sendContent);
      `,
        `

      const sendContent = {
        code: "codeGenerate",
        username: "usernameTest",
        itemSecret: "nameSecret"
      };
      `,
        '../',
      ),
    ).toEqual({ code: 'codeGenerate', username: 'usernameTest', itemSecret: 'nameSecret' });

    expect(
      getContentSend(
        `\nconst response = await requestDoc(app).post('/user')
          .send({ name: 'greg', email: 'greg@github.com' }).expect(400);`,
        '',
        '../',
      ),
    ).toEqual({ name: 'greg', email: 'greg@github.com' });
  });

  it('should get description in it or test', () => {
    expect(getDescriptionLocal(`it("any content", () => { \n /* doc: Handle magic users */`)).toEqual(
      'Handle magic users',
    );
    expect(getDescriptionLocal(`it("http://* content", () => { \n /* doc: This is a comment  */`)).toEqual(
      'This is a comment',
    );
    expect(getDescriptionLocal(`test("any ABC 123", () => { \n /* doc: a big description \n\n */`)).toEqual(
      'a big description',
    );
    expect(getDescriptionLocal(`it("any content", () => { \n /* doc- a lower description? */`)).toEqual(
      'a lower description?',
    );
  });

  it('should get query params', () => {
    expect(
      getQueryParams(`
          const orderId = "ASC";
          let pageNumber = 13;
          var valueTrue = true;
          const branchData = 'data';
          const productId = 123;

          routerDoc.get("/myPage?sort=981a&page=\${pageNumber}&showDetails=\${valueTrue}&name=\${branchData}&products=\${productId}")
        `),
    ).toEqual([
      { example: '981a', in: 'query', required: null, tag: 'sort', type: 'unknown', variable: '' },
      { example: 13, in: 'query', required: null, tag: 'page', type: 'number', variable: 'pageNumber' },
      { example: true, in: 'query', required: null, tag: 'showDetails', type: 'boolean', variable: 'valueTrue' },
      { example: 'data', in: 'query', required: null, tag: 'name', type: 'string', variable: 'branchData' },
      { example: 123, in: 'query', required: null, tag: 'products', type: 'number', variable: 'productId' },
    ]);
  });

  it('should get url params', () => {
    expect(getUrlParams(`requestdoc.get('/users/\${userId}').send()`, `const userId = 1234`)).toEqual([
      {
        example: 1234,
        in: 'param',
        required: null,
        tag: 'userId',
        type: 'number',
        variable: 'userId',
      },
    ]);
  });

  it('should get send content', () => {
    expect(
      getFullDescription(`
            describe('Any', () => {
            /* doc: Description Full Description */
        `),
    ).toEqual('Description Full Description');

    expect(
      getFullDescription(`
  describe('Any with Markdow http://',  (  ) => {
  /* doc:
  # Title
  ## Subtitle
   this is a comment
  Description Full Description
  \`\`\`
    code example
  \`\`\`

  */

  No Here
        `),
    ).toEqual(`# Title
  ## Subtitle
   this is a comment
  Description Full Description
  \`\`\`
    code example
  \`\`\``);
  });

  it('should get a router content', () => {
    expect(getRouterRequest(`requestDoc.get('/users').send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc\n\n.get('/users').send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc(app).get('/users/posts-data').send()`)).toEqual('/users/posts-data');
    expect(getRouterRequest(`requestDoc.get("/users").send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc.get(\`/users\`).send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc.get(\`/users/\${userId}\`).send()`)).toEqual('/users/${userId}');
  });

  it('should get a router content', () => {
    const response = getExpectedResponseDynamically(
      `
      expect(response.body[0].follow).toEqual(1);
      expect(response.body[0].name).toEqual("Name");
      expect(response.body[0].boolean).toEqual(true);
      expect(response.body[0].object).toEqual({ name: 'abc'});
      expect(response.body[0].following).toEqual([1, 2]);

      `,
      ``,
      {},
      '../',
    );
    expect(response).toEqual({
      body: [{ boolean: true, object: { name: 'abc' }, follow: 1, name: 'Name', following: [1, 2] }],
    });
  });
});
