import statusCode from '@/example/statusCode';
import generateDocs from '../index';

describe('Complete test', () => {
  it('any test', () => {
    expect(generateDocs({ statusCode })).toEqual({
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
                    path: '/user',
                    headers: '',
                    response: {
                      statusCode: '200',
                      body: '',
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
                    path: '/user',
                    fullPath: '/user',
                    headers: '',
                    response: {
                      statusCode: '409',
                      body: '',
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
                    path: '/user',
                    headers: {
                      Authorization: 'Bearer exampleJwt',
                    },
                    response: {
                      statusCode: '200',
                      body: '',
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
                    path: '/user',
                    headers: {
                      Authorization: 'Bearer exampleJwt',
                    },
                    response: {
                      statusCode: '200',
                      body: '',
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
                    path: '/user',
                    fullPath: '/user/${userId}',
                    headers: {
                      Authorization: 'Bearer exampleJwt',
                    },
                    response: {
                      statusCode: '200',
                      body: '',
                    },
                  },
                ],
              },
            },
          },
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
                    path: '/post',
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
          description: 'O cadastro de posts precisa ser solicitada aos desenvolvedores',
          title: 'Gerenciamento de posts',
        },
      ],
      docs: '# Bem vindo a documentação da API do blog Valorant tips\n\nEstá documentação contém toda a parte técnica relacionada a API do blog [dicas de valorant](https://valorant-tips.vercel.app/), sendo a primeira usando a bibliteca doctbytest\n\n',
    });
  });
});
