/* eslint-disable no-underscore-dangle */
import supertest from 'supertest';
import { app } from '../app';
import mockTests from '../mocks/tests.json';

const request = supertest(app);
const tokenValido = {};
const idUsuarioValido = '981C513A511';
const idUser2Valido = '981C513A511';

const user = mockTests.createUser;

describe('Testes gerais', () => {
  test('[doc]: Deve retornar um Usuário', async () => {
    const response = await request.get(`/user/${idUsuarioValido}`).set(tokenValido);

    expect(response.statusCode).toEqual(200);
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].email).toBeDefined();
    expect(response.body[0].username).toBeDefined();
  });

  test('[doc]: Usuário 1 deve seguir o usuário 2', async () => {
    const response = await request.post(`/user/follow/${idUser2Valido}`).set(tokenValido);

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('User cannot follow himself!');
    expect(response.body.followed).toEqual(true);
  });

  test('[doc]: Obter os dados de si mesmo e verificar que está seguindo o usuario 2', async () => {
    const response = await request.get('/me').set(tokenValido);

    expect(response.body[0].name).toEqual('lilian');
    expect(response.body[0].email).toEqual('no-valid-email@fakemail.com');
    expect(response.body[0].username).toEqual('sherek');
    expect(response.body[0].following).toEqual([1, 2]);
    expect(response.body[0].followers).toEqual([]); // alert
    expect(response.body[0].following[0]._id).toEqual(idUser2Valido);

    expect(response.statusCode).toEqual(200);
  });

  test('[doc]: Deve permitir a edição de um usuario!', async () => {
    const response = await request.put(`/user/${idUsuarioValido}`).set(tokenValido).send({
      name: 'alterado',
      password: 'gabriel',
      username: 'alterado2',
      itemBio: [
        ["school", "Graduou em análise e desenvolvimento de Sistemas na Fatec Araçatuba"],
        ["status", "Solteiro"],
        ["work", "Desenvolvedor web"],
        ["film", "Interestelar"]
      ],
      bio: "Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes",
      motivational: "Loremmmmmmm snsadnadlaldjsaddssasdaad",
    });

    expect(response.body.name).toEqual('alterado');
    expect(response.body.bio).toEqual('Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes');
    expect(response.body.motivational).toEqual('Loremmmmmmm snsadnadlaldjsaddssasdaad');
    expect(response.body.itemBio[0].text).toEqual("Graduou em análise e desenvolvimento de Sistemas na Fatec Araçatuba"],);
  });
});
