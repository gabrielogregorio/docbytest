import supertest from 'supertest';
import { app } from '../app';

const request = supertest(app);
const token = {};
const userIdValid2 = '981C513A511';
const userIdValid = '981C513A511';

describe('User', () => {
  test('[doc]: Get user', async () => {
    const response = await request.get(`/user/${userIdValid2}`).set(token);

    expect(response.statusCode).toEqual(200);
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].email).toBeDefined();
    expect(response.body[0].username).toBeDefined();
  });

  test('[doc]: User 1 follow user 2', async () => {
    const response = await request.post(`/user/follow/${userIdValid}`).set(token);

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('User cannot follow himself!');
    expect(response.body.followed).toEqual(true);
  });

  test('[doc]: Get self, and verify if following user 2', async () => {
    const response = await request.get('/me').set(token);

    expect(response.body[0].name).toEqual('lilian');
    expect(response.body[0].email).toEqual('any@mail.com');
    expect(response.body[0].username).toEqual('bond, super bond');
    expect(response.body[0].following).toEqual([1, 2]);
    expect(response.body[0].followers).toEqual([]);
    expect(response.body[0].following[0]._id).toEqual(userIdValid);

    expect(response.statusCode).toEqual(200);
  });

  test('[doc]: Update self', async () => {
    const response = await request
      .put(`/user/${userIdValid2}`)
      .set(token)
      .send({
        name: 'updated',
        itemSecret: 'gabriel',
        username: 'updated2',
        itemBio: [
          ['school', 'Graduation in Systems Analysis and Development at'],
          ['status', 'unmarried'],
          ['work', 'Web develop'],
          ['film', 'Interstellar'],
        ],
        bio: 'Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes',
        motivational: 'motivationalMock',
      });

    expect(response.body.name).toEqual('updated');
    expect(response.body.bio).toEqual('Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes');
    expect(response.body.motivational).toEqual('motivationalMock');
  });
});
