const request: any = {};

const testDoc = it;

describe('Gerenciamento de posts', () => {
  // doc.description: "O cadastro de posts precisa ser solicitada aos desenvolvedores"

  testDoc('obtém os dados de um post', async () => {
    const postId = 123;
    const limitPost = 4;
    const offsetPost = 30;

    const response = await request
      .get(`/post/${postId}?limit=${limitPost}&offset=${offsetPost}`)
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
