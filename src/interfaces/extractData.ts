export type parametersType = {
  in: 'query' | 'param';
  name: string;
  example: string | number | boolean;
  variable: string;
  type: string;
};

export type caseTestType = {
  method: string;
  sendContent: string | number | boolean | object;
  parameters: parametersType[];
  title: string;
  description: string;
  path: string;
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
