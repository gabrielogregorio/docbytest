<div align="center">

# DOCBYTEST - Experimental project

![NPM package](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

<a href="https://backend-valorant.herokuapp.com/docs" target="blank">Example in api valorant tips </a>
</div>

## Introduction
This is a library that generates the documentation of an API based initially on integration tests with supertest!

## How use
Do you need install docbytest and docbytest-ui

```bash
npm i docbytest
npm i docbytest-ui
```

Create docbytest file with keys
```json
// docbytest.config.json
{
  "folderTests": "./src/example/test",
  "docFile": "./docs/base.md",
  "statusCodeErrorFile": "./src/example/statusCode.ts"
}
```

Create docs file
```md
// ./docs/base.md
# 💻 API docbytest

This is a documentation [types valorant](https://valorant-tips.vercel.app/).

## Open code

* item 1
* item 2
* item 3

## Erros

This is erros

[Table of errors](errors_status_table)

### Example

This is a code, use "`" for render code, similar github readme
```

Create status code file
```ts
// ./src/example/statusCode.ts
const statusCode = {
  SUCCESS: {
    code: 200,
    description: 'Ok',
  },
  SUCCESS_NO_CONTENT: {
    code: 204,
    description: 'Ops, not content',
  }
}

export default statusCode
```

configure server in your express api

```ts
import express from 'express';
import docbytest from 'docbytest';
import statusCode from './config/statusCode';

export const app = express();

// config doc-json
app.get('/docs-json', (req, res) =>
  res.json(
    docbytest({
      statusCode,
    }),
  ),
);

// configure docbytest-ui
app.get('/docs', (_req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/docbytest-ui/build', 'index.html'));
});

app.use('/docs/static', express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/static/')));

app.use(
  '/docs/manifest.json',
  express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/manifest.json')),
);

app.use('/docs/favicon.ico', express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/favicon.ico')));

app.use('/docs/logo.png', express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/docs/logo.png')));

// Start your server
app.listen(3333);
```

Access your api in "/docs"

## Write your tests
Create tests, use folder configured in docbytest.config.json from save your specs or tests.
> use 2 spaces in your code!!!

```js
describe('🙋 Suggestions', () => {
  /* doc:
    your comments from suit
  */

  test('[doc]: ✅ send suggestions', async () => {
  /* doc: your comments from all tests */

    const suggestionId = 123456
    const res = await request.put(`/suggestion/${suggestionId}`).send({
      title: 'new title',
      body: 'new body'
    });

    // success example
    expect(res.statusCode).toEqual(200);
    expect(mock.body.id).toBeDefined()

    const mock = {body: {...res.body, id: 123456}}

    expect(mock.body).toEqual({
      id: 123456,
      title: 'new title',
      body: 'new body'
    });
  });

  test('[doc]: 🚫 block suggestion without params', async () => {
    const suggestionId = 123456
    const res = await request.put(`/suggestion/${suggestionId}`).send({});

    expect(res.statusCode).toEqual(400);

    expect(re.body).toEqual({
      message: 'bad Request'
    });
  });

  test('tests not docs', async () => {
    // ....
  });
});
```

## Tips
Use icons 🆗 👍 📂 👉 🤏 🔒 🤷 🤦‍♀️ 👨‍🔧 👀 ✅ 👤 🚫 🙋 💻 📔 🔑 🧑‍💻 🔐

More icons in [https://unicode.org](https://unicode.org/emoji/charts/full-emoji-list.html)

This is experimental!
