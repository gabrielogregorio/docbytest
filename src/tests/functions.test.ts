import {
  getStatusCodeExpected,
  getResponseExpected,
  getSendContent,
  getDescriptionLocal,
  getRouterRequest,
  getFullDescription,
  getFullDescribe,
  getHeder,
  getQueryParams,
  getUrlParams,
} from '../helpers/helpers';

describe('Suite', () => {
  it('should return status code', () => {
    expect(getStatusCodeExpected('expect(response.statusCode)\n.toBe(200);')).toEqual('200');
    expect(getStatusCodeExpected('expect(res.statusCode).toBe(\n 301\n).toTest()')).toEqual('301');
    expect(getStatusCodeExpected('expect(res.statusCode).toBe( 500);')).toEqual('500');
    expect(getStatusCodeExpected('expect(response.statusCode).toEqual(403);')).toEqual('403');
  });

  it('should return expected response', () => {
    expect(
      getHeder(
        `
        const response = await requestDoc.post('/user').send('token').set({
          Authorization: '3'
        });
        `,
        '',
      ),
    ).toEqual({
      Authorization: '3',
    });

    expect(
      getHeder(
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
      ),
    ).toEqual({
      Authorization: '3',
      test: [{ item: 123 }],
    });

    expect(
      getHeder(
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
      ),
    ).toEqual({
      Authorization: '3',
      test: [{ item: 123 }],
    });
  });

  it('should return expected response', () => {
    expect(
      getResponseExpected(
        `expect(response.body).toMatchObject(
          {
            userName: 'Lucas Santos',
            posts: [
              { Name: 'Julia',
              user_name: 'Santos'
            }]
          });`,
        '',
      ),
    ).toEqual({ userName: 'Lucas Santos', posts: [{ Name: 'Julia', user_name: 'Santos' }] });

    expect(getResponseExpected(`expect(res.body).toMatchObject({ userName: 'Lucas Santos' });`, '')).toEqual({
      userName: 'Lucas Santos',
    });

    expect(getResponseExpected(`expect(res__.body)\n.toMatchObject({\n\nuserName: 'Lucas Santos' });`, '')).toEqual({
      userName: 'Lucas Santos',
    });

    expect(getResponseExpected(`expect(res.body).toStrictEqual({ message: 'Error in data' });`, '')).toEqual({
      message: 'Error in data',
    });

    expect(getResponseExpected(`expect(res.body).toEqual({ message: 'Error in data' });`, '')).toEqual({
      message: 'Error in data',
    });
  });

  it('should get send content', () => {
    expect(
      getSendContent(
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
      ),
    ).toEqual({ text: 'This is a comment', test: [123] });

    expect(
      getSendContent(
        `
        const response = await requestDoc.post(\`/post/comment/\${variableId}\`)
        .set(token)
        .send({
          text: 'this response',
          replie: 190 });`,
        '',
      ),
    ).toEqual({ text: 'this response', replie: 190 });

    expect(
      getSendContent(
        `\nconst response = await requestDoc.post(\`/post/comment/\${variableId}\`).set(
          token
          )
          .send('hi');`,
        '',
      ),
    ).toEqual('hi');

    expect(
      getSendContent(
        `
        const response = await requestDoc
        .post('/user')
        .send({
          code: "codeGenerate",
          username: "userTest.password",
          password: "userTest.username"
        }
        );
      `,
        '',
      ),
    ).toEqual({ code: 'codeGenerate', username: 'userTest.password', password: 'userTest.username' });

    expect(
      getSendContent(
        `
        const response = await requestDoc
        .post('/user')
        .send(sendContent);
      `,
        `

      const sendContent = {
        code: "codeGenerate",
        username: "userTest.password",
        password: "userTest.username"
      };
      `,
      ),
    ).toEqual({ code: 'codeGenerate', username: 'userTest.password', password: 'userTest.username' });

    expect(
      getSendContent(
        `\nconst response = await requestDoc(app).post('/user')
          .send({ name: 'greg', email: 'greg@github.com' }).expect(400);`,
        '',
      ),
    ).toEqual({ name: 'greg', email: 'greg@github.com' });
  });

  it('should get description in it or test', () => {
    expect(getDescriptionLocal(`// doc.description: "Handle magic users"`)).toEqual('Handle magic users');
    expect(getDescriptionLocal(`// doc.description: "This is a comment"`)).toEqual('This is a comment');
    expect(getDescriptionLocal(`// doc.description: "a big description"`)).toEqual('a big description');
    expect(getDescriptionLocal(`// doc.description:"a lower description?"`)).toEqual('a lower description?');
  });

  it('should get query params', () => {
    expect(
      getQueryParams(`
        const orderId = "ASC";
        let pageNumber = 13;
        var valueTrue = true;
        const branchData = 'data';
        const productId = 123;

        routerDoc.get("/myPage?sort=\${orderId}&page=\${pageNumber}&showDetails=\${valueTrue}&name=\${branchData}&products=\${productId}")
      `),
    ).toEqual([
      { example: 'ASC', in: 'query', required: null, tag: 'sort', type: 'string', variable: 'orderId' },
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
        // doc.description: "Description Full Description"
    `),
    ).toEqual('Description Full Description');
  });

  it('should get a router content', () => {
    expect(getRouterRequest(`requestDoc.get('/users').send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc\n\n.get('/users').send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc(app).get('/users/posts-data').send()`)).toEqual('/users/posts-data');
    expect(getRouterRequest(`requestDoc.get("/users").send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc.get(\`/users\`).send()`)).toEqual('/users');
    expect(getRouterRequest(`requestDoc.get(\`/users/\${userId}\`).send()`)).toEqual('/users/${userId}');
  });

  it('should get a full describe', () => {
    expect(
      getFullDescribe(`
describe('Crud Users', () => {
  testDoc('Should cadaster one user', async () => {
    const response = await request.post('/user').send({
      code: codeGenerate,
      username: userTest.password,
      password: userTest.username,
    });
  });
});
      `),
    ).toEqual({
      code: `  testDoc('Should cadaster one user', async () => {
    const response = await request.post('/user').send({
      code: codeGenerate,
      username: userTest.password,
      password: userTest.username,
    });
  });
`,
      title: 'Crud Users',
    });
  });
});