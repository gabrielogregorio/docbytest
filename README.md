<div align="center">

# DOCBYTEST

![NPM package](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

<a href="https://backend-valorant.herokuapp.com/docs" target="blank">Example in api valorant tips (heroku) </a>
</div>

![version 0.2](/docs/v0.2.png)

## Introduction
This is a library that generates the documentation of an API based initially on integration tests with supertest!

## Summary
- [For NPM users](#For-NPM-users)
- [Write your tests](#Write-your-tests)
- [Example CI in Github](#Example-ci-in-github)
- [Use Icons](#Use-Icons)
- [Colors to comments](#Colors-to-comments)
- [For devs](#For-devs)
- [How use in develop mode](#How-use-in-develop-mode)
- [How integrated with docbytest-ui](#How-integrated-with-docbytest-ui)
- [Contributing with project](#Contributing-with-project)
- [Avaliable Scripts](#Avaliable-Scripts)

## For NPM/Yarn users
Do you need install docbytest and docbytest-ui

```bash
npm i docbytest
npm i docbytest-ui
```

or

```bash
yarn add docbytest
yarn add docbytest-ui
```

Create docbytest
| Key | Description |
|-------|---------|
|folderTests|folder where your tests, specifications or tests are|
|docFile|Folder where your docbytest integrated documentation files will be|
|statusCodeErrorFile|Your status code file, following the docbytetest pattern|
```js
// docbytest.config.json
{
  "folderTests": "./src/example/test",
  "docFile": "./docs/",
  "statusCodeErrorFile": "./src/example/statusCode.ts"
}
```

1. Create docs file
```md
// ./docs/introduction/example.md

# 💻 API Example

This is a documentation [docbytest](https://github.com/gabrielogregorio/docbytest).

## Open code

* item 1
* item 2
* item 3

## Errors

This is errors, based in STATUS CODE FILE

[Table of errors](errors_status_table)

## Example any Table

| Extension | Description | Author |
|-----------|--------|---------|
| Eslint  | For linting code | Microsoft |
| Prettier - Code formatter | For beautifully formate code | Prettier |
| Prettier Eslint  | Integration prettier and eslint | Rebecca Vest |


### Example code

For coding use "`" , similar github readme

## Example comment

> orange # 💡 What is docbytest
> [docbytest](https://github.com/gabrielogregorio/docbytest) is the project used to generate this documentation from tests

```

2. Create status code file, use this example for start your project
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

3. Configure server in your express api

```ts
import express from 'express';
import docbytest from 'docbytest';
import statusCode from './example /statusCode';
import path from 'path'

export const app = express();

app.get('/docs-json', async (req, res) => {
  const authToken = req.body.authorization; // optional
  const returnDev = isAuthenticate(authToken); // optional => false to hidden dev docs

  return res.json(
    await docbytest({
      statusCode,
      returnDev,
    }),
  );
});


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

// Start your server
app.listen(3333);
```

Access **your api in "/docs"**

### Write your tests
Create tests, use folder configured in docbytest.config.json from save your specs or tests.
> use 2 spaces in your code!!!

```js
/* 1 is order show cases*/
describe('[1] 🙋 Suggestions', () => {
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

### Example CI in Github
* [ci - tests with mongoose db](https://github.com/gabrielogregorio/docbytest-example-api/blob/main/CI/ci-mongodb.yml)

### Use Icons
🆗 👍 📂 ⚙ 🛡 🛠 🌍 💡 🤓 🚀 ✈ 🛰 🛸 🕛 🎉 👏 🥳 💵 📚 💳 👩‍🚀 ☢ ⚠ ❌ 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🏁 👈 👉 🤏 🔒 🔓 🤷 🤦‍♀️ 👨‍🔧 👀 ✅ 👤 🚫 🙋 💻 📔 🔑 🧑‍💻 🔐 ✏ 📬 🗓 ▶ ⏩ ⏭ ⏯ 🔼 🔽 ⏹ 📶

More icons in [https://unicode.org](https://unicode.org/emoji/charts/full-emoji-list.html)


### Colors to comments

Do you can comments using colors or no, example
```md
> orange # 💡 What is docbytest
> [docbytest](https://github.com/gabrielogregorio/docbytest) is the project used to generate this documentation from tests
```

or

```md
> # 💡 What is docbytest
> [docbytest](https://github.com/gabrielogregorio/docbytest) is the project used to generate this documentation from tests
```
Do you can choose those colors

* purple
* orange
* red
* yellow
* green
* emerald
* teal
* cyan
* sky
* blue
* indigo
* violet
* purple
* pink
* lime

## For developers of doc bytest
### How use in develop mode
1. First, access this root dir from docbytest, and run
```bash
npm install
npm run build
npm link
```

2. Clone [docbytest-example-api](https://github.com/gabrielogregorio/docbytest-example-api)
3. Access **docbytest-example-api** in root dir, install packages and link docbytest
```bash
npm install
npm link docbytest
```
5. Start docbytest-example-api, with command
```bash
npm run dev
```
6. Access [http://127.0.0.1:3333/docs-json](http://127.0.0.1:3333/docs-json) to see json docs

### How integrated with docbytest-ui
1. Clone [docbytest-ui](https://github.com/gabrielogregorio/docbytest-ui)
3. Access **docbytest-ui** and install packages
```bash
npm install
```
5. Start docbytest-ui, with command
```bash
npm run dev
```
6. Update "./docbytest-ui/src/core/hooks/useGetUrlApi.ts" to
```typescript
export const useGetUrlApi = () => {
  const currentUrlAPi = 'http://127.0.0.1:3333/docs'; // window.location.href;
  const currentUrlOrigin = 'http://127.0.0.1:3333'; // window.location.origin;

  return {
    currentUrlAPi,
    currentUrlOrigin,
  };
};
```
6. Access [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs) to see docbytest-ui
### Contributing with project

Read [Contributing.md](CONTRIBUTING.md)
### Avaliable Scripts

```bash
npm run dev
npm run jest:watchAll
```
