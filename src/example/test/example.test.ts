// @ts-ignore
import objectMockJsonExample from '@/mocksExample/folder/example.json';
// @ts-ignore
import mockTitle from 'mocksExample/folder/example2.json';
import mockJsonExample from '../../mocksExample/index.json';

const requestExample1: any = {};

const userTest = {
  username: 'username mock',
  itemSecret: 'item secret mock',
};

const token = {
  Authorization: 'Bearer exampleJwt',
};

describe('[35]: User', () => {
  /* doc: User management system */

  it('[doc]: Create user', async () => {
    const response = await requestExample1.post('/user').send(userTest);

    expect(response.statusCode).toEqual(200);
  });

  it('[doc]: Prevents the registration of a user that already exists', async () => {
    const response = await requestExample1.post('/user').send(mockJsonExample);

    expect(response.statusCode).toEqual(409);
  });

  it('Must log into the system and get a token', async () => {
    const response = await requestExample1.post('/auth').send({
      username: 'username',
      itemSecret: 'password',
    });

    expect(response.statusCode).toEqual(200);
  });

  it('[doc]: Get the data of the logged in user', async () => {
    const response = await requestExample1.get(`/user`).set(token);

    expect(response.statusCode).toEqual(200);

    expect(response.body.username).toEqual('username test');
    expect(response.body.length).toEqual(6);
    expect(response.body.password).toBeUndefined();
  });

  it('[doc]: Update a user', async () => {
    const userId = 213;
    const res = await requestExample1.put(`/user/${userId}`).set(token).send({
      test: 'isTest',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual(mockTitle);
    expect(res.body.document.items[1].id).toEqual('1234');
    expect(res.body.document.items[0].name).toEqual('maria');
  });

  it('[doc]: Delete yourself', async () => {
    const response = await requestExample1.delete(`/user`).set(token);
    expect(response.body).toEqual(objectMockJsonExample);

    expect(response.statusCode).toEqual(200);
  });
});
