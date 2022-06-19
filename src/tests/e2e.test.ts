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
