import {
  getStatusCodeExpected,
  getResponseExpected,
  getSendContent,
  getDescriptionLocal,
  getRouterRequest,
  getFullDescription,
} from '../src/helpers';

describe('Suite', () => {
  it('should return status code', () => {
    expect(getStatusCodeExpected('expect(response.statusCode).toBe(200);')).toEqual('200');
    expect(getStatusCodeExpected('\n\n\\expect(   res.statusCode).toBe( 301)\n\n\n;')).toEqual('301');
    expect(getStatusCodeExpected('\n\n\\expect(   res.statusCode).toBe( 500   )\n\n\n;')).toEqual('500');
    expect(getStatusCodeExpected('expect(response.statusCode).toEqual(403);')).toEqual('403');
  });

  it('should return expected response', () => {
    expect(
      getResponseExpected(
        `expect(response.body).toMatchObject({ userName: 'Lucas Santos', posts: [{ Name: 'Julia', user_name: 'Santos' }] });`,
      ),
    ).toEqual({ userName: 'Lucas Santos', posts: [{ Name: 'Julia', user_name: 'Santos' }] });

    expect(getResponseExpected(`expect(res.body).toMatchObject({ userName: 'Lucas Santos' });`)).toEqual({
      userName: 'Lucas Santos',
    });

    expect(getResponseExpected(`expect(res__.body).toMatchObject({ userName: 'Lucas Santos' });`)).toEqual({
      userName: 'Lucas Santos',
    });

    expect(getResponseExpected(`expect(res.body).toStrictEqual({ message: 'Error in data' });`)).toEqual({
      message: 'Error in data',
    });

    expect(getResponseExpected(`expect(res.body).toEqual({ message: 'Error in data' });`)).toEqual({
      message: 'Error in data',
    });
  });

  it('should get send content', () => {
    expect(
      getSendContent(
        `\n\n\nconst response = await request.post(\`/post/comment/11111111\`).set(tokenValido).send({ text: 'This is a comment' });\n\n`,
      ),
    ).toEqual({ text: 'This is a comment' });

    expect(
      getSendContent(
        `
        const response = await request.post(\`/post/comment/\${idPostValido}\`).set(token).send({ text: 'this response', replie: 190 });`,
      ),
    ).toEqual({ text: 'this response', replie: 190 });

    expect(
      getSendContent(
        `
        const response = await request
        .post('/user')
        .send({ code: "codeGenerate", username: "userTest.password", password: "userTest.username" });
      `,
      ),
    ).toEqual({ code: 'codeGenerate', username: 'userTest.password', password: 'userTest.username' });

    expect(
      getSendContent(
        `
        const respnse = await request(app).post('/user').send({ name: 'greg', email: 'greg@github.com' }).expect(400);   `,
      ),
    ).toEqual({ name: 'greg', email: 'greg@github.com' });
  });

  it('should get send content', () => {
    expect(getDescriptionLocal(`// doc.description: "Lida com os usuários do sistema bancário 37"`)).toEqual(
      'Lida com os usuários do sistema bancário 37',
    );

    expect(getDescriptionLocal(`// doc.description: "Lida com os usuários do sistema\n\nbancário 37"`)).toEqual(
      'Lida com os usuários do sistema\n\nbancário 37',
    );

    expect(getDescriptionLocal(`// doc.description: "37"`)).toEqual('37');

    expect(getDescriptionLocal(`// doc.description:"37"`)).toEqual('37');
  });

  it('should get send content', () => {
    expect(
      getFullDescription(`
    describe('Testa o CRUD de usuários', () => {
      // doc.description: "Lida com os usuários do sistema bancário 37"
    `),
    ).toEqual('Lida com os usuários do sistema bancário 37');
  });

  it('should get a router content', () => {
    expect(
      getRouterRequest(`
      request.get('/users').send()
      `),
    ).toEqual('/users');

    expect(
      getRouterRequest(`
      request(app).get('/users/posts-data').send()
      `),
    ).toEqual('/users/posts-data');

    expect(
      getRouterRequest(`
      request.get("/users").send()
      `),
    ).toEqual('/users');

    expect(
      getRouterRequest(`
      request.get(\`/users\`).send()
      `),
    ).toEqual('/users');

    expect(
      getRouterRequest(`
      request.get(\`/users/\${userId}\`).send()
      `),
    ).toEqual('/users/${userId}');
  });
});
