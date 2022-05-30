const statusCode = {
  SUCCESS: {
    code: 200,
    description: 'Tudo ocorreu com sucesso',
  },
  SUCCESS_NO_CONTENT: {
    code: 204,
    description: 'Retorno sem conteúdo',
  },
  BAD_REQUEST: {
    code: 400,
    description: 'Você esqueceu de passar algum parâmetro na requisição',
  },
  NEED_TOKEN: {
    code: 401,
    description: 'Você precisa de um token de autenticação, ou o seu token expirou',
  },
  NEED_TOKEN_2: {
    code: 403,
    description: '	Você não tem permissão para acessar essa região.',
  },
};

export default statusCode;
