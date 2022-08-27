export type paramsType = {
  tag: string;
  variable: string;
  in: 'query' | 'param';
  example: string | number | boolean;
  required: null;
  type: string;
};

export type caseTestType = {
  method: string;
  sendContent: string | number | boolean | object;
  params: paramsType[];
  title: string;
  description: string;
  router: string;
  fullPath: string;
  headers: string | number | boolean | object;
  response: {
    statusCode: number;
    body: string | number | true | object;
  };
};

export type typeExtractDataFromTextType = {
  cases: caseTestType[];
  title: string;
  order: number;
  description: string;
};
