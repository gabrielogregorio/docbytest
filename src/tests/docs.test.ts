import { mountMdDocs } from '../helpers/mountMdDocs';

const documentation = `
# Bem vindo a documentação

Blog [dicas de valorant](https://valorant-tips.vercel.app/), sendo a primeira usando a bibliteca doctbytest

## Erros

Nossa API usa os códigos tradicionais das

[Tabela de erros](errors_status_table)

## Autenticação

Alguns endpoints precisam de autenticação, você pode conseguir uma chave de acesso informando um login e senha válidos.

[Documentação de endpoints](client_test_paths)`;

const statusCode = {
  SUCCESS: {
    code: 200,
    description: 'Tudo ocorreu com sucesso',
  },
  SUCCESS_NO_CONTENT: {
    code: 204,
    description: 'Retorno sem conteúdo',
  },
};

describe('Suite', () => {
  it('should return status code', () => {
    expect(mountMdDocs(documentation, statusCode)).toEqual(
      `
# Bem vindo a documentação

Blog [dicas de valorant](https://valorant-tips.vercel.app/), sendo a primeira usando a bibliteca doctbytest

## Erros

Nossa API usa os códigos tradicionais das

| statusCode | description |
|---------|----------|
| 200 | Tudo ocorreu com sucesso |
| 204 | Retorno sem conteúdo |


## Autenticação

Alguns endpoints precisam de autenticação, você pode conseguir uma chave de acesso informando um login e senha válidos.

[Documentação de endpoints](client_test_paths)
`,
    );
  });
});
