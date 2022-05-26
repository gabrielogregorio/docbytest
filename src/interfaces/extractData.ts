export type paramsType = {
  example: string;
  in: 'query' | 'param';
  required: null;
  tag: string;
  type: string;
  variable: string;
};

export type casesType = {
  method: string;
  sendContent: string;
  params: paramsType[];
  title: string;
  description: string;
  router: string;
  path: string;
  headers: any;
  response: {
    statusCode: string;
    body: string;
  };
};

export type typeExtractDataFromTextType = {
  cases: casesType[];
  title: string;
  description: string;
};
