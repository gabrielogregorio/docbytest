const requestExample2: any = {};

describe('Posts', () => {
  /* doc: The registration of posts must be requested from the developers */

  test('[doc]: Get posts', async () => {
    const postId = 123;
    const limitPost = 4;
    const offsetPost = 30;

    const response = await requestExample2
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
