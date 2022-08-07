<div align="center">

# DOCBYTEST - EXPERIMENTAL

![NPM package](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

<a href="https://backend-valorant.herokuapp.com/docs" target="blank">Example in api valorant tips (heroku) </a>
</div>

![version 0.2](/docs/v0.2.png)


<div align="center">

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/23041cf8832e412094ad901c55883f3c)](https://www.codacy.com/gh/gabrielogregorio/docbytest/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gabrielogregorio/docbytest&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/23041cf8832e412094ad901c55883f3c)](https://www.codacy.com/gh/gabrielogregorio/docbytest/dashboard?utm_source=github.com&utm_medium=referral&utm_content=gabrielogregorio/docbytest&utm_campaign=Badge_Coverage)

</div>

## Introduction
This is a library that generates the documentation of an API based initially on integration tests with supertest!

🚀 [Example in pratic](https://github.com/gabrielogregorio/docbytest-example-api)

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

Use [docbytest example api](https://github.com/gabrielogregorio/docbytest-example-api) for reference for project.
### Write your tests
Create tests with this pattern
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

  it('[doc]: 🚫 block suggestion without params', async () => {
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
*   [ci tests with mongoose db](https://github.com/gabrielogregorio/docbytest-example-api/blob/main/CI/ci-mongodb.yml)
