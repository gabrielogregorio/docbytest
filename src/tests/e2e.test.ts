/* eslint-disable @typescript-eslint/no-magic-numbers */
import statusCode from '@/example/statusCode';
import { BIG_SORT_NUMBER } from '../constants/variables';
import generateDocs, { makeDocsReturnType } from '../index';

const Authorization: string = 'Bearer exampleJwt';
const userWithValidId: string = '/user/${userIdValid2}';

describe('Complete test', () => {
  it('any test', async () => {
    const jsonText: makeDocsReturnType = await generateDocs(statusCode);
    expect(jsonText).toEqual({
      suites: [
        {
          paths: {
            '/user': {
              post: [
                {
                  method: 'post',
                  sendContent: {
                    username: 'username mock',
                    itemSecret: 'item secret mock',
                  },
                  parameters: [],
                  title: 'Create user',
                  description: '',
                  path: '/user',
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
                  parameters: [],
                  title: 'Prevents the registration of a user that already exists',
                  description: '',
                  path: '/user',
                  headers: '',
                  response: {
                    statusCode: 409,
                    body: {},
                  },
                },
              ],

              get: [
                {
                  method: 'get',
                  sendContent: '',
                  parameters: [],
                  title: 'Get the data of the logged in user',
                  description: '',
                  path: '/user',
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

              delete: [
                {
                  method: 'delete',
                  sendContent: '',
                  parameters: [],
                  title: 'Delete yourself',
                  description: '',
                  path: '/user',
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

            '/user/${userId}': {
              put: [
                {
                  method: 'put',
                  sendContent: { test: 'isTest' },
                  parameters: [
                    {
                      example: 213,
                      in: 'param',
                      name: 'userId',
                      type: 'number',
                      variable: 'userId',
                    },
                  ],
                  title: 'Update a user',
                  description: '',
                  path: '/user/${userId}',
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
          order: 35,
          description: 'User management system',
          title: 'User',
        },
        {
          paths: {
            '/post/${postId}': {
              get: [
                {
                  description: '',
                  headers: {
                    token: '1234',
                  },
                  method: 'get',
                  parameters: [
                    {
                      example: 123,
                      in: 'param',
                      name: 'postId',
                      type: 'number',
                      variable: 'postId',
                    },
                    {
                      example: 4,
                      in: 'query',
                      name: 'limit',
                      type: 'number',
                      variable: 'limitPost',
                    },
                    {
                      example: 30,
                      in: 'query',
                      name: 'offset',
                      type: 'number',
                      variable: 'offsetPost',
                    },
                  ],
                  path: '/post/${postId}',
                  response: {
                    body: {
                      item: '4321',
                    },
                    statusCode: 200,
                  },
                  sendContent: {
                    _user_id: 123,
                    item: '123',
                  },
                  title: 'Get posts',
                },
              ],
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
              get: [
                {
                  description: '',
                  path: userWithValidId,
                  headers: {},
                  method: 'get',
                  parameters: [
                    {
                      example: '981C513A511',
                      in: 'param',
                      name: 'userIdValid2',
                      type: 'string',
                      variable: 'userIdValid2',
                    },
                  ],
                  response: {
                    body: {},
                    statusCode: 200,
                  },
                  sendContent: '',
                  title: 'Get user',
                },
              ],

              put: [
                {
                  description: '',
                  path: userWithValidId,
                  headers: {},
                  method: 'put',
                  parameters: [
                    {
                      example: '981C513A511',
                      in: 'param',
                      name: 'userIdValid2',
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
            '/user/follow/${userIdValid}': {
              post: [
                {
                  description: '',
                  path: '/user/follow/${userIdValid}',
                  headers: {},
                  method: 'post',
                  parameters: [
                    {
                      example: '981C513A511',
                      in: 'param',
                      name: 'userIdValid',
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
                  sendContent: '',
                  title: 'User 1 follow user 2',
                },
              ],
            },
            '/me': {
              get: [
                {
                  description: '',
                  path: '/me',
                  headers: {},
                  method: 'get',
                  parameters: [],
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
                  sendContent: '',
                  title: 'Get self, and verify if following user 2',
                },
              ],
            },
          },
          title: 'User',
        },
        {
          description: '',
          order: 999,
          paths: {
            '/user': {
              delete: [
                {
                  description: '',
                  path: '/user',
                  headers: '',
                  method: 'delete',
                  parameters: [],
                  response: {
                    body: {},
                    statusCode: 200,
                  },
                  sendContent: '',
                  title: 'Deve deletar um usuário',
                },
              ],
            },
            '/users': {
              get: [
                {
                  description: '',
                  path: '/users',
                  headers: '',
                  method: 'get',
                  parameters: [],
                  response: {
                    body: {},
                    statusCode: 200,
                  },
                  sendContent: '',
                  title: 'Deve retornar uma lista de usuários',
                },
              ],
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
