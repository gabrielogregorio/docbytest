const request: any = {};

describe('Gerenciamento de sugestões', () => {
  test('[dev]: obtém os dados de um post', async () => {
    const response = await request
      .get(`/suggestions`)
      .set({
        token: '1234',
      })
      .send({
        item: '123',
        _user_id: 123,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      item: '4321',
    });
  });
});
