const request: any = {};

const userTest = {
  username: 'abc',
  password: '123',
};

const token = {
  Authorization: 'Bearer exampleJwt',
};

const testDoc = it;

describe('Gerenciamento de usuários', () => {
  // doc.description: "O cadastro de usuário precisa ser solicitada aos desenvolvedores"

  testDoc('Cadastrar um usuário', async () => {
    const response = await request.post('/user').send(userTest);

    expect(response.statusCode).toEqual(200);
  });

  testDoc('Impede o cadastro de um usuário que já existe', async () => {
    const response = await request.post('/user').send({
      code: '123',
      username: 'username',
      password: 'password',
    });

    expect(response.statusCode).toEqual(409);
  });

  it('Deve fazer login no sistema e obter um token', async () => {
    const response = await request.post('/auth').send({
      username: 'username',
      password: 'password',
    });

    expect(response.statusCode).toEqual(200);
  });

  testDoc('obtém os dados do próprio usuário', async () => {
    const response = await request.get(`/user`).set(token);

    expect(response.statusCode).toEqual(200);

    expect(response.body.username).toEqual('testSystemAfk37812-++aks22');
    expect(response.body.password).toBeUndefined();
  });

  testDoc('Edita um user', async () => {
    const userId = 213;
    const res = await request.put(`/user/${userId}`).set(token).send({
      test: '132',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('acss');
  });

  testDoc('deletar a si mesmo', async () => {
    const response = await request.delete(`/user`).set(token);

    expect(response.statusCode).toEqual(200);
  });
});
