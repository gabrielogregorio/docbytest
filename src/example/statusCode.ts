type statusCodeTypeType = {
  [key: string]: {
    code: number;
    description: string;
  };
};

const statusCode: statusCodeTypeType = {
  SUCCESS: {
    code: 200,
    description: 'Ok',
  },
  SUCCESS_NO_CONTENT: {
    code: 204,
    description: 'no content',
  },
  NEED_TOKEN: {
    code: 401,
    description: 'not permission',
  },
};

export default statusCode;
