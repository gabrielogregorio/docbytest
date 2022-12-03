export enum ParametersInEnum {
  query = 'query',
  param = 'param',
}

export type parametersExampleType = string | number | boolean;

export interface IParameters {
  in: ParametersInEnum;
  name: string;
  example: parametersExampleType;
  variable: string;
  type: string;
}

export type contentRequestType =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | contentRequestType[]
  | { [key: string]: contentRequestType }
  | { [key: string]: contentRequestType }[];

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
