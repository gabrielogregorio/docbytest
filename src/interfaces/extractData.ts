export enum parametersInEnum {
  query = 'query',
  param = 'param',
}

export type parametersExampleType = string | number | boolean;

export interface IParameters {
  in: parametersInEnum;
  name: string;
  example: parametersExampleType;
  variable: string;
  type: string;
}

export type contentRequestType = string | number | boolean | object;

export interface ITestCase {
  method: string;
  sendContent: contentRequestType;
  parameters: IParameters[];
  title: string;
  description: string;
  path: string;
  headers: contentRequestType;
  response: {
    statusCode: number;
    body: contentRequestType;
  };
}
