export type paramsType = {
  example: string;
  in: 'query' | 'param';
  required: null;
  tag: string;
  type: string;
  variable: string;
};

export type caseType = {
  method: string;
  sendContent: string;
  params: paramsType[];
  title: string;
  description: string;
  router: string;
  fullPath: string;
  headers: any;
  response: {
    statusCode: number;
    body: string;
  };
};

export type typeExtractDataFromTextType = {
  cases: caseType[];
  title: string;
  order: number;
  description: string;
};
