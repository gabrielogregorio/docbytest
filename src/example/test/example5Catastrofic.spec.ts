const requestExample5: any = {
  get: () => null,
};

const tokenValido = '';
const token2Valido = '';

describe('Catastrofic Example', () => {
  test('[doc]: Deve retornar uma lista de usuários', async () => {
    const response = await requestExample5.get('/users').set(tokenValido);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[1].itemBio);

    const mockData = {
      body: [
        {
          ...response.body[0],
          _id: '62b2547268502ba2c2b59ccc',
          itemBio: [
            {
              ...response.body[0].itemBio[0],
              _id: '62b2549b1dfa1e04da0cc57d',
              user: '62b2549a1dfa1e04da0cc566',
            },
            {
              ...response.body[0].itemBio[1],
              _id: '62b2549b1dfa1e04da0cc57e',
              user: '62b2549a1dfa1e04da0cc566',
            },
            {
              ...response.body[0].itemBio[2],
              _id: '62b2549b1dfa1e04da0cc57f',
              user: '62b2549a1dfa1e04da0cc566',
            },
            {
              ...response.body[0].itemBio[3],
              _id: '62b2549b1dfa1e04da0cc580',
              user: '62b2549a1dfa1e04da0cc566',
            },
          ],
        },
      ],
    };

    expect(mockData.body).toEqual([
      {
        _id: '62b2547268502ba2c2b59ccc',
        name: 'sherek',
        username: 'sherek',
        email: 'no-valid-email@fakemail.com',
        img: '',
        bio: 'Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes',
        motivational: 'Loremmmmmmm snsadnadlaldjsaddssasdaad',
        itemBio: [
          {
            _id: '62b2549b1dfa1e04da0cc57d',
            text: 'Graduou em análise e desenvolvimento de Sistemas na Fatec Araçatuba',
            typeItem: 'school',
            user: '62b2549a1dfa1e04da0cc566',
            __v: 0,
          },
          {
            _id: '62b2549b1dfa1e04da0cc57e',
            text: 'Solteiro',
            typeItem: 'status',
            user: '62b2549a1dfa1e04da0cc566',
            __v: 0,
          },
          {
            _id: '62b2549b1dfa1e04da0cc57f',
            text: 'Desenvolvedor web',
            typeItem: 'work',
            user: '62b2549a1dfa1e04da0cc566',
            __v: 0,
          },
          {
            _id: '62b2549b1dfa1e04da0cc580',
            text: 'Interestelar',
            typeItem: 'film',
            user: '62b2549a1dfa1e04da0cc566',
            __v: 0,
          },
        ],
        followers: [],
        following: [],
        followersIds: [],
        followingIds: [],
      },
    ]);
  });

  test('[doc]: Deve deletar um usuário', async () => {
    const response = await requestExample5.delete('/user').set(token2Valido);

    expect(response.statusCode).toEqual(200);
  });
});
