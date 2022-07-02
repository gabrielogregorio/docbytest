import statusCode from '@/example/statusCode';
import { BIG_SORT_NUMBER } from '../constants/variables';
import generateDocs from '../index';

describe('Complete test', () => {
  it('any test', async () => {
    expect(await generateDocs({ statusCode })).toEqual({
      files: [
        {
          paths: {
            '/user': {
              post: {
                tests: [
                  {
                    method: 'post',
                    sendContent: {
                      username: 'abc',
                      password: '123',
                    },
                    params: [],
                    title: 'Cadastrar um usuário',
                    description: '',
                    fullPath: '/user',
                    router: '/user',
                    headers: '',
                    response: {
                      statusCode: '200',
                      body: null,
                    },
                  },
                  {
                    method: 'post',
                    sendContent: {
                      code: '123',
                      username: 'username',
                      password: 'password',
                    },
                    params: [],
                    title: 'Impede o cadastro de um usuário que já existe',
                    description: '',
                    router: '/user',
                    fullPath: '/user',
                    headers: '',
                    response: {
                      statusCode: '409',
                      body: null,
                    },
                  },
                ],
              },

              get: {
                tests: [
                  {
                    method: 'get',
                    sendContent: '',
                    params: [],
                    title: 'obtém os dados do próprio usuário',
                    description: '',
                    fullPath: '/user',
                    router: '/user',
                    headers: {
                      Authorization: 'Bearer exampleJwt',
                    },
                    response: {
                      statusCode: '200',
                      body: {
                        username: 'testSystemAfk37812-++aks22',
                      },
                    },
                  },
                ],
              },

              delete: {
                tests: [
                  {
                    method: 'delete',
                    sendContent: '',
                    params: [],
                    title: 'deletar a si mesmo',
                    description: '',
                    fullPath: '/user',
                    router: '/user',
                    headers: {
                      Authorization: 'Bearer exampleJwt',
                    },
                    response: {
                      statusCode: '200',
                      body: null,
                    },
                  },
                ],
              },
            },

            '/user/${userId}': {
              put: {
                tests: [
                  {
                    method: 'put',
                    sendContent: { test: '132' },
                    params: [
                      {
                        example: 213,
                        in: 'param',
                        required: null,
                        tag: 'userId',
                        type: 'number',
                        variable: 'userId',
                      },
                    ],
                    title: 'Edita um user',
                    description: '',
                    router: '/user/${userId}',
                    fullPath: '/user/${userId}',
                    headers: {
                      Authorization: 'Bearer exampleJwt',
                    },
                    response: {
                      statusCode: '200',
                      body: {
                        document: {
                          items: [
                            {
                              name: 'maria',
                            },
                            {
                              id: 'K45AS134G35343',
                            },
                          ],
                        },
                        title: 'acss',
                      },
                    },
                  },
                ],
              },
            },
          },
          order: 35,
          description: 'O cadastro de usuário precisa ser solicitada aos desenvolvedores',
          title: 'Gerenciamento de usuários',
        },
        {
          paths: {
            '/post/${postId}': {
              get: {
                tests: [
                  {
                    description: '',
                    headers: {
                      token: '1234',
                    },
                    method: 'get',
                    params: [
                      {
                        example: 123,
                        in: 'param',
                        required: null,
                        tag: 'postId',
                        type: 'number',
                        variable: 'postId',
                      },
                      {
                        example: 4,
                        in: 'query',
                        required: null,
                        tag: 'limit',
                        type: 'number',
                        variable: 'limitPost',
                      },
                      {
                        example: 30,
                        in: 'query',
                        required: null,
                        tag: 'offset',
                        type: 'number',
                        variable: 'offsetPost',
                      },
                    ],
                    fullPath: '/post/${postId}',
                    response: {
                      body: {
                        item: '4321',
                      },
                      statusCode: '200',
                    },
                    router: '/post/${postId}?limit=${limitPost}&offset=${offsetPost}',
                    sendContent: {
                      _user_id: 123,
                      item: '123',
                    },
                    title: 'obtém os dados de um post',
                  },
                ],
              },
            },
          },
          order: BIG_SORT_NUMBER,
          description: 'O cadastro de posts precisa ser solicitada aos desenvolvedores',
          title: 'Gerenciamento de posts',
        },
        {
          description: '',
          order: 999,
          paths: {
            '/user/${idUsuarioValido}': {
              get: {
                tests: [
                  {
                    description: '',
                    fullPath: '/user/${idUsuarioValido}',
                    headers: {},
                    method: 'get',
                    params: [
                      {
                        example: '981C513A511',
                        in: 'param',
                        required: null,
                        tag: 'idUsuarioValido',
                        type: 'string',
                        variable: 'idUsuarioValido',
                      },
                    ],
                    response: {
                      body: null,
                      statusCode: '200',
                    },
                    router: '/user/${idUsuarioValido}',
                    sendContent: '',
                    title: 'Deve retornar um Usuário',
                  },
                ],
              },
              put: {
                tests: [
                  {
                    description: '',
                    fullPath: '/user/${idUsuarioValido}',
                    headers: {},
                    method: 'put',
                    params: [
                      {
                        example: '981C513A511',
                        in: 'param',
                        required: null,
                        tag: 'idUsuarioValido',
                        type: 'string',
                        variable: 'idUsuarioValido',
                      },
                    ],
                    response: {
                      body: {
                        bio: `Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes`,
                        itemBio: [
                          {
                            text: '',
                          },
                        ],
                        motivational: 'Loremmmmmmm snsadnadlaldjsaddssasdaad',
                        name: 'alterado',
                      },
                      statusCode: '',
                    },
                    router: '/user/${idUsuarioValido}',
                    sendContent: {
                      bio: `Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes`,
                      itemBio: [
                        ['school', 'Graduou em análise e desenvolvimento de Sistemas na Fatec Araçatuba'],
                        ['status', 'Solteiro'],
                        ['work', 'Desenvolvedor web'],
                        ['film', 'Interestelar'],
                      ],
                      motivational: 'Loremmmmmmm snsadnadlaldjsaddssasdaad',
                      name: 'alterado',
                      password: 'gabriel',
                      username: 'alterado2',
                    },
                    title: 'Deve permitir a edição de um usuario!',
                  },
                ],
              },
            },
            '/user/follow/${idUser2Valido}': {
              post: {
                tests: [
                  {
                    description: '',
                    fullPath: '/user/follow/${idUser2Valido}',
                    headers: {},
                    method: 'post',
                    params: [
                      {
                        example: '981C513A511',
                        in: 'param',
                        required: null,
                        tag: 'idUser2Valido',
                        type: 'string',
                        variable: 'idUser2Valido',
                      },
                    ],
                    response: {
                      body: {
                        followed: true,
                        msg: 'User cannot follow himself!',
                      },
                      statusCode: '200',
                    },
                    router: '/user/follow/${idUser2Valido}',
                    sendContent: '',
                    title: 'Usuário 1 deve seguir o usuário 2',
                  },
                ],
              },
            },
            '/me': {
              get: {
                tests: [
                  {
                    description: '',
                    fullPath: '/me',
                    headers: {},
                    method: 'get',
                    params: [],
                    response: {
                      body: [
                        {
                          email: 'no-valid-email@fakemail.com',
                          followers: undefined,
                          following: [
                            {
                              _id: '981C513A511',
                            },
                            2,
                          ],

                          name: 'lilian',
                          username: 'sherek',
                        },
                      ],
                      statusCode: '200',
                    },
                    router: '/me',
                    sendContent: '',
                    title: 'Obter os dados de si mesmo e verificar que está seguindo o usuario 2',
                  },
                ],
              },
            },
          },
          title: 'Testes gerais',
        },
        {
          description: '',
          order: 999,
          paths: {
            '/user': {
              delete: {
                tests: [
                  {
                    description: '',
                    fullPath: '/user',
                    headers: '',
                    method: 'delete',
                    params: [],
                    response: {
                      body: null,
                      statusCode: '200',
                    },
                    router: '/user',
                    sendContent: '',
                    title: 'Deve deletar um usuário',
                  },
                ],
              },
            },
            '/users': {
              get: {
                tests: [
                  {
                    description: '',
                    fullPath: '/users',
                    headers: '',
                    method: 'get',
                    params: [],
                    response: {
                      body: null,
                      statusCode: '200',
                    },
                    router: '/users',
                    sendContent: '',
                    title: 'Deve retornar uma lista de usuários',
                  },
                ],
              },
            },
          },
          title: 'Catastrofic Example',
        },
      ],

      docs: [
        {
          order: 1,
          title: '🚀 GETTING STARTED',
          docs: [
            {
              title: 'Introduction',
              order: 1,
              text: '# Introduction\nexample\n\n',
            },
            {
              title: '❌ Errors',
              order: 3,
              text: '# ❌ Errors\nExample Errors\n\n| statusCode | description |\n|---------|----------|\n| 200 | Ok |\n| 204 | no content |\n| 401 | not permission |\n\ntest\n\n',
            },
          ],
        },
        {
          order: 999,
          title: '💻 EXAMPLES',
          docs: [
            {
              title: '📀 Examples',
              order: 999,
              text: '# 📀 Examples\nExample of example\n\n',
            },
          ],
        },
      ],
    });
  });
});
