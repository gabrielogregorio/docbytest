import {
  getStatusCode,
  getResponseSimple,
  getContentSendTestCase,
  getDescriptionTest,
  getRouter,
  getDescriptionSuite,
  getHeader,
  getQueryParams,
  getParams,
  getResponseDynamically,
} from '../helpers/helpers';

const usernameTest: string = 'Lucas Santos';

describe('Suite', () => {
  it('should return status code', () => {
    expect(getStatusCode({ testCaseText: 'expect(response.statusCode)\n.toBe(200);' })).toEqual(200);
    expect(getStatusCode({ testCaseText: 'expect(res.statusCode).toBe(\n 301\n).toTest()' })).toEqual(301);
    expect(getStatusCode({ testCaseText: 'expect(res.statusCode).toBe( 500);' })).toEqual(500);
    expect(getStatusCode({ testCaseText: 'expect(response.statusCode).toEqual(403);' })).toEqual(403);
  });

  it('should return expected response', () => {
    expect(
      getHeader({
        testCaseText: `
          const response = await requestDoc.post('/user').send('token').set({
            Authorization: '3'
          });
          `,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({
      Authorization: '3',
    });

    expect(
      getHeader({
        testCaseText: `
          const response = await requestDoc.post('/user')
          .send('token')
          .set({
            Authorization: '3',
            test: [
              {item: 123}
            ]
          });
          `,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({
      Authorization: '3',
      test: [{ item: 123 }],
    });

    expect(
      getHeader({
        testCaseText: `const response = await requestDoc.post('/user')
          .send('token')
          .set(dataToken);
          `,
        textFileTest: `

          const dataToken = {
            Authorization: '3',
            test: [
              {item: 123}
            ]
          };`,
        directoryAllTests: '../',
      }),
    ).toEqual({
      Authorization: '3',
      test: [{ item: 123 }],
    });
  });

  it('should return expected response', () => {
    expect(
      getResponseSimple({
        testCaseText: `expect(response.body).toMatchObject(
    {
      userName: 'Lucas Santos',
      posts: [
        { Name: 'Julia',
        user_name: 'Santos'
      }]
    });`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({ userName: usernameTest, posts: [{ Name: 'Julia', user_name: 'Santos' }] });

    expect(
      getResponseSimple({
        testCaseText: `expect(res.body).toMatchObject({ userName: 'Lucas Santos' });`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({
      userName: usernameTest,
    });

    expect(
      getResponseSimple({
        testCaseText: `expect(res__.body)\n.toMatchObject({\n\nuserName: 'Lucas Santos' });`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({
      userName: usernameTest,
    });

    expect(
      getResponseSimple({
        testCaseText: `expect(res.body).toStrictEqual({ message: 'Error in data' });`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({
      message: 'Error in data',
    });

    expect(
      getResponseSimple({
        testCaseText: `expect(res.body).toEqual({ message: 'Error in data' });`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({
      message: 'Error in data',
    });
  });

  it('should get send content', () => {
    expect(
      getContentSendTestCase({
        testCaseText: `const response = await request_doc.post(\`/post/comment/11111111\`)
        .set(token).send(
          {
            text: 'This is a comment',
            test: [
              123
            ]
          }
          );\n\n`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({ text: 'This is a comment', test: [123] });

    expect(
      getContentSendTestCase({
        testCaseText: `
  const response = await requestDoc.post(\`/post/comment/\${variableId}\`)
  .set(token)
  .send({
    text: 'this response',
    replie: 190 });`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({ text: 'this response', replie: 190 });

    expect(
      getContentSendTestCase({
        testCaseText: `\nconst response = await requestDoc.post(\`/post/comment/\${variableId}\`).set(
    token
    )
    .send('hi');`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual('hi');

    expect(
      getContentSendTestCase({
        testCaseText: `
          const response = await requestDoc
          .post('/user')
          .send({
            code: "codeGenerate",
            username: "usernameTest",
            itemSecret: "nameSecret"
          }
          );
        `,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({ code: 'codeGenerate', username: 'usernameTest', itemSecret: 'nameSecret' });

    expect(
      getContentSendTestCase({
        testCaseText: `
          const response = await requestDoc
          .post('/user')
          .send(sendContent);
        `,
        textFileTest: `

          const sendContent = {
            code: "codeGenerate",
            username: "usernameTest",
            itemSecret: "nameSecret"
          };
          `,
        directoryAllTests: '../',
      }),
    ).toEqual({ code: 'codeGenerate', username: 'usernameTest', itemSecret: 'nameSecret' });

    expect(
      getContentSendTestCase({
        testCaseText: `\nconst response = await requestDoc(app).post('/user')
          .send({ name: 'greg', email: 'greg@github.com' }).expect(400);`,
        textFileTest: '',
        directoryAllTests: '../',
      }),
    ).toEqual({ name: 'greg', email: 'greg@github.com' });
  });

  it('should get description in it or test', () => {
    expect(getDescriptionTest({ testCaseText: `it("any content", () => { \n /* doc: Handle magic users */` })).toEqual(
      'Handle magic users',
    );
    expect(
      getDescriptionTest({ testCaseText: `it("http://* content", () => { \n /* doc: This is a comment  */` }),
    ).toEqual('This is a comment');
    expect(
      getDescriptionTest({ testCaseText: `test("any ABC 123", () => { \n /* doc: a big description \n\n */` }),
    ).toEqual('a big description');
    expect(
      getDescriptionTest({ testCaseText: `it("any content", () => { \n /* doc- a lower description? */` }),
    ).toEqual('a lower description?');
  });

  it('should get query params', () => {
    expect(
      getQueryParams({
        testCaseText: `
          const orderId = "ASC";
          let pageNumber = 13;
          var valueTrue = true;
          const branchData = 'data';
          const productId = 123;

          routerDoc.get("/myPage?sort=981a&page=\${pageNumber}&showDetails=\${valueTrue}&name=\${branchData}&products=\${productId}")
        `,
      }),
    ).toEqual([
      { example: '981a', in: 'query', required: null, tag: 'sort', type: 'unknown', variable: '' },
      { example: 13, in: 'query', required: null, tag: 'page', type: 'number', variable: 'pageNumber' },
      { example: true, in: 'query', required: null, tag: 'showDetails', type: 'boolean', variable: 'valueTrue' },
      { example: 'data', in: 'query', required: null, tag: 'name', type: 'string', variable: 'branchData' },
      { example: 123, in: 'query', required: null, tag: 'products', type: 'number', variable: 'productId' },
    ]);
  });

  it('should get url params', () => {
    expect(
      getParams({
        testCaseText: `requestdoc.get('/users/\${userId}').send()`,
        textFileTest: `const userId = 1234`,
      }),
    ).toEqual([
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
      getDescriptionSuite({
        textFileTest: `
            describe('Any', () => {
            /* doc: Description Full Description */
        `,
      }),
    ).toEqual('Description Full Description');

    expect(
      getDescriptionSuite({
        textFileTest: `
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
        `,
      }),
    ).toEqual(`# Title
  ## Subtitle
   this is a comment
  Description Full Description
  \`\`\`
    code example
  \`\`\``);
  });

  it('should get a router content', () => {
    expect(getRouter({ testCaseText: `requestDoc.get('/users').send()` })).toEqual('/users');
    expect(getRouter({ testCaseText: `requestDoc\n\n.get('/users').send()` })).toEqual('/users');
    expect(getRouter({ testCaseText: `requestDoc(app).get('/users/posts-data').send()` })).toEqual('/users/posts-data');
    expect(getRouter({ testCaseText: `requestDoc.get("/users").send()` })).toEqual('/users');
    expect(getRouter({ testCaseText: `requestDoc.get(\`/users\`).send()` })).toEqual('/users');
    expect(getRouter({ testCaseText: `requestDoc.get(\`/users/\${userId}\`).send()` })).toEqual('/users/${userId}');
  });

  it('should get a router content', () => {
    const response: object = getResponseDynamically({
      testCaseText: `
  expect(response.body[0].follow).toEqual(1);
  expect(response.body[0].name).toEqual("Name");
  expect(response.body[0].boolean).toEqual(true);
  expect(response.body[0].object).toEqual({ name: 'abc'});
  expect(response.body[0].following).toEqual([1, 2]);

  `,
      textFileTest: '',
      object: {},
      directoryAllTests: '../',
    });
    expect(response).toEqual({
      body: [{ boolean: true, object: { name: 'abc' }, follow: 1, name: 'Name', following: [1, 2] }],
    });
  });
});
