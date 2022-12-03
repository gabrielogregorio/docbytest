import { IParameters, ParametersInEnum } from '../../interfaces/extractData';
import { getTypeVariable } from './getTypeVariable';

const RE_GET_FULL_URL: RegExp = /\(['"`](.{3,600}?)['"`]\)/;
const GROUP_POSITION_TEXT_INSIDE_URL: number = 1;
export const getQueryParameters = ({ testCaseText }: { testCaseText: string }): IParameters[] => {
  const matchGetFullUrl: RegExpExecArray | null = RE_GET_FULL_URL.exec(testCaseText);
  const fullUrlRequest: string | undefined = matchGetFullUrl?.[GROUP_POSITION_TEXT_INSIDE_URL];
  const queryParameters: IParameters[] = [];

  if (fullUrlRequest) {
    const urlParsed: URL = new URL(fullUrlRequest, 'http://localhost/');

    const searchParameters: URLSearchParams = new URLSearchParams(urlParsed.search);

    searchParameters.forEach((variable: string, property: string) => {
      const value: string = variable.trim();
      const INCREMENT_IGNORE_START_VARIABLE: number = 2;
      const DECREMENT_IGNORE_END_VARIABLE: number = 1;
      const valueWithinVariableStart: string = value.slice(
        INCREMENT_IGNORE_START_VARIABLE,
        value.length - DECREMENT_IGNORE_END_VARIABLE,
      );

      const isVariable: boolean = value.startsWith('${');
      queryParameters.push({
        name: property,
        variable: isVariable ? valueWithinVariableStart : '',
        in: ParametersInEnum.query,
        type: getTypeVariable(valueWithinVariableStart, testCaseText).type,
        example: isVariable ? getTypeVariable(valueWithinVariableStart, testCaseText).content : value,
      });
    });

    return queryParameters;
  }
  return [];
};
