import statusCode from '@/example/statusCode';
import { BIG_SORT_NUMBER } from '../constants/variables';
import generateDocs from '../index';

const Authorization = 'Bearer exampleJwt';
const userWithValidId = '/user/${userIdValid2}';

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
                      username: 'username mock',
                      itemSecret: 'item secret mock',
                    },
                    params: [],
                    title: 'Create user',
                    description: '',
                    fullPath: '/user',
                    router: '/user',
                    headers: '',
                    response: {
                      statusCode: 200,
                      body: {},
                    },
                  },
                  {
                    method: 'post',
                    sendContent: {
                      code: '123',
                      username: 'username',
                      itemSecret: 'password',
                    },
                    params: [],
                    title: 'Prevents the registration of a user that already exists',
                    description: '',
                    router: '/user',
                    fullPath: '/user',
                    headers: '',
                    response: {
                      statusCode: 409,
                      body: {},
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
                    title: 'Get the data of the logged in user',
                    description: '',
                    fullPath: '/user',
                    router: '/user',
                    headers: {
                      Authorization,
                    },
                    response: {
                      statusCode: 200,
                      body: {
                        username: 'username test',
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
                    title: 'Delete yourself',
                    description: '',
                    fullPath: '/user',
                    router: '/user',
                    headers: {
                      Authorization,
                    },
                    response: {
                      statusCode: 200,
                      body: {
                        username: 'username',
                        itemSecret: 'password',
                      },
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
                    sendContent: { test: 'isTest' },
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
                    title: 'Update a user',
                    description: '',
                    router: '/user/${userId}',
                    fullPath: '/user/${userId}',
                    headers: {
                      Authorization,
                    },
                    response: {
                      statusCode: 200,
                      body: {
                        document: {
                          items: [
                            {
                              name: 'maria',
                            },
                            {
                              id: '1234',
                            },
                          ],
                        },
                        title: {
                          titleExample: 'example title',
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          order: 35,
          description: 'User management system',
          title: 'User',
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
                      statusCode: 200,
                    },
                    router: '/post/${postId}?limit=${limitPost}&offset=${offsetPost}',
                    sendContent: {
                      _user_id: 123,
                      item: '123',
                    },
                    title: 'Get posts',
                  },
                ],
              },
            },
          },
          order: BIG_SORT_NUMBER,
          description: 'The registration of posts must be requested from the developers',
          title: 'Posts',
        },

        {
          description: '',
          order: 999,
          paths: {
            '/user/${userIdValid2}': {
              get: {
                tests: [
                  {
                    description: '',
                    fullPath: userWithValidId,
                    headers: {},
                    method: 'get',
                    params: [
                      {
                        example: '981C513A511',
                        in: 'param',
                        required: null,
                        tag: 'userIdValid2',
                        type: 'string',
                        variable: 'userIdValid2',
                      },
                    ],
                    response: {
                      body: {},
                      statusCode: 200,
                    },
                    router: userWithValidId,
                    sendContent: '',
                    title: 'Get user',
                  },
                ],
              },
              put: {
                tests: [
                  {
                    description: '',
                    fullPath: userWithValidId,
                    headers: {},
                    method: 'put',
                    params: [
                      {
                        example: '981C513A511',
                        in: 'param',
                        required: null,
                        tag: 'userIdValid2',
                        type: 'string',
                        variable: 'userIdValid2',
                      },
                    ],
                    response: {
                      body: {
                        bio: `Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes`,
                        motivational: 'motivationalMock',
                        name: 'updated',
                      },
                      statusCode: 0,
                    },
                    router: userWithValidId,
                    sendContent: {
                      bio: `Lucas 🌻\n🏠 \n⏳ 23\n♍ testetesttesttestestes`,
                      itemBio: [
                        ['school', 'Graduation in Systems Analysis and Development at'],
                        ['status', 'unmarried'],
                        ['work', 'Web develop'],
                        ['film', 'Interstellar'],
                      ],
                      motivational: 'motivationalMock',
                      name: 'updated',
                      itemSecret: 'gabriel',
                      username: 'updated2',
                    },
                    title: 'Update self',
                  },
                ],
              },
            },
            '/user/follow/${userIdValid}': {
              post: {
                tests: [
                  {
                    description: '',
                    fullPath: '/user/follow/${userIdValid}',
                    headers: {},
                    method: 'post',
                    params: [
                      {
                        example: '981C513A511',
                        in: 'param',
                        required: null,
                        tag: 'userIdValid',
                        type: 'string',
                        variable: 'userIdValid',
                      },
                    ],
                    response: {
                      body: {
                        followed: true,
                        msg: 'User cannot follow himself!',
                      },
                      statusCode: 200,
                    },
                    router: '/user/follow/${userIdValid}',
                    sendContent: '',
                    title: 'User 1 follow user 2',
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
                          email: 'any@mail.com',
                          followers: undefined,
                          following: [
                            {
                              _id: '981C513A511',
                            },
                            2,
                          ],

                          name: 'lilian',
                          username: 'bond, super bond',
                        },
                      ],
                      statusCode: 200,
                    },
                    router: '/me',
                    sendContent: '',
                    title: 'Get self, and verify if following user 2',
                  },
                ],
              },
            },
          },
          title: 'User',
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
                      body: {},
                      statusCode: 200,
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
                      body: {},
                      statusCode: 200,
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
