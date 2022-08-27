import { dynamicAssembly } from './dynamicAssembly';
import { mergeRecursive } from './mergeRecursive';
import { BIG_SORT_NUMBER, LIMIT_PREVENT_INFINITE_LOOPS } from '../constants/variables';
import { parametersType } from '../interfaces/extractData';
import { findValueInCode } from './findValueInCode';

const REGEX_GROUP_STRING: string = `\\(['"\`](.*?)['"\`]\\)`;

export const getResponseSimple = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): string | number | boolean | object => {
  const regex: RegExp = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return findValueInCode(match[2], textFileTest, directoryAllTests);
  }
  return '';
};

const mountDynamicObject = (
  expectedResponse: string,
  command: string,
  completeObject: object,
  oneTestText: string,
  pathFull: string,
): object => {
  let valueExtracted: string | number | boolean | object = findValueInCode(
    expectedResponse.replace(/'/gi, '"'),
    oneTestText,
    pathFull,
  );
  if (typeof valueExtracted === 'string' && valueExtracted[0] !== '"') {
    valueExtracted = `"${valueExtracted}"`;
  }
  const transform: string = dynamicAssembly(command, valueExtracted);

  return mergeRecursive(completeObject, JSON.parse(transform.replace(/'/g, '"')));
};

export const getResponseDynamically = ({
  testCaseText,
  textFileTest,
  object,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  object: object;
  directoryAllTests: string;
}): object => {
  let completeObject: object = object;
  const regexDynamicBody: RegExp = /expect\(\w{1,300}\.(body[^)]+)\)\.toEqual\(([^)]{1,9999})/gi;

  for (let increment: number = 0; increment <= LIMIT_PREVENT_INFINITE_LOOPS; increment += 1) {
    const regexRouter: RegExpExecArray = regexDynamicBody.exec(testCaseText);

    if (regexRouter) {
      const command: string = regexRouter[1];
      const expectedResponse: string = regexRouter[2];

      const isFunctionFromObject: boolean = !command.endsWith('length');
      if (isFunctionFromObject) {
        try {
          completeObject = mountDynamicObject(
            expectedResponse,
            command,
            completeObject,
            textFileTest,
            directoryAllTests,
          );
        } catch (error: unknown) {
          //
        }
      }
    }

    if (!regexRouter) {
      break;
    }
  }

  return completeObject;
};

export const getStatusCode = ({ testCaseText }: { testCaseText: string }): number => {
  const RE_EXPECTED_STATUS_CODE: RegExp =
    /expect\(([\w\d]{1,50}\.statusCode)\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject|toBe)\(\s{0,20}(\d{3})\s{0,20}\)/;

  const matchExpectedStatusCode: RegExpExecArray = RE_EXPECTED_STATUS_CODE.exec(testCaseText);
  if (matchExpectedStatusCode) {
    return Number(matchExpectedStatusCode[3]);
  }
  return 0;
};

export const getContentSendTestCase = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): string | number | boolean | object => {
  const RE_CONTENT_SEND: RegExp = /\.send\(([^))]{1,9999})[\S\s]{0,500}\)[\S\s]{0,500}[;\\.]/;
  const contentSend: RegExpExecArray | null = RE_CONTENT_SEND.exec(testCaseText);
  if (contentSend) {
    return findValueInCode(contentSend[1], textFileTest, directoryAllTests);
  }
  return '';
};

export const getHeader = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): string | number | boolean | object => {
  const RE_SEND_HEADER: RegExp = /\.set\(([^(\\);)]*)/;
  const sendHeader: RegExpExecArray | null = RE_SEND_HEADER.exec(testCaseText);

  if (sendHeader) {
    return findValueInCode(sendHeader[1], textFileTest, directoryAllTests);
  }
  return '';
};

export const getMethod = ({ testCaseText }: { testCaseText: string }): string => {
  const RE_REQUEST_METHOD: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const requestMethod: RegExpExecArray = RE_REQUEST_METHOD.exec(testCaseText);
  if (requestMethod) {
    return requestMethod[1];
  }
  return '';
};

export const getRouter = ({ testCaseText }: { testCaseText: string }): string => {
  const regex: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return match[2];
  }
  return '';
};

export const getRouterParameters = ({ router }: { router: string }): string => {
  const regex: RegExp = /([/\w/{}$]+)*/;
  const match: RegExpExecArray = regex.exec(router);
  if (match) {
    return match[1];
  }

  return '';
};

const removeDocPrefix = (content: string): string => content.replace(/^\s*\[doc\]\s*[:-]\s*/, '');

export const getNameTest = ({ testCaseText }: { testCaseText: string }): string => {
  const regex: RegExp = /(it|test)\(['`"](.*?)['`"]/;
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return removeDocPrefix(match[2]);
  }

  return '';
};

export type getTitleSuiteType = {
  text: string;
  order: number;
};

export const getTitleSuite = ({ textFileTest }: { textFileTest: string }): getTitleSuiteType => {
  const regex: RegExp = /describe\(['"`]\s{0,12}(\[\s{0,12}(\d{1,10})?\s{0,12}\]\s{0,12}:?)?\s{0,12}(.*)['"`]/;
  const match: RegExpExecArray = regex.exec(textFileTest);
  if (match) {
    return { text: match[3], order: Number(match[2]) || BIG_SORT_NUMBER };
  }
  return { text: '', order: BIG_SORT_NUMBER };
};

export const getDescriptionTest = ({ testCaseText }: { testCaseText: string }): string => {
  const regex: RegExp = /(it|test).*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return match[2].trim();
  }
  return '';
};

export const getDescriptionSuite = ({ textFileTest }: { textFileTest: string }): string => {
  const regex: RegExp = /describe.*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray = regex.exec(textFileTest);
  if (match) {
    return match[1].trim();
  }
  return '';
};

export type getVariable = {
  type: 'number' | 'boolean' | 'string' | 'unknown';
  content: string | number | boolean;
};

export const getTypeVariable = (variable: string, fullCode: string): getVariable => {
  const regexString: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*['"\`](.*)['"\`]`);
  const regexNumber: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*(\\d+)`);
  const regexBoolean: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*(false|true)`);

  if (regexString.exec(fullCode)) {
    return { type: 'string', content: regexString.exec(fullCode)?.[1]?.toString() };
  }

  if (regexNumber.exec(fullCode)) {
    return { type: 'number', content: Number(regexNumber.exec(fullCode)?.[1].toString()) };
  }

  if (regexBoolean.exec(fullCode)) {
    return { type: 'boolean', content: regexBoolean.exec(fullCode)?.[1]?.toString() === 'true' };
  }

  return { type: 'unknown', content: '' };
};

const RE_GET_FULL_URL: RegExp = /\(['"`](.{3,600}?)['"`]\)/;
export const getQueryParameters = ({ testCaseText }: { testCaseText: string }): parametersType[] => {
  const matchGetFullUrl: RegExpExecArray = RE_GET_FULL_URL.exec(testCaseText);
  const fullUrlRequest: string = matchGetFullUrl?.[1];
  const queryParameters: parametersType[] = [];

  if (fullUrlRequest) {
    const urlParsed: URL = new URL(fullUrlRequest, 'http://localhost/');

    const searchParameters: URLSearchParams = new URLSearchParams(urlParsed.search);

    searchParameters.forEach((variable: string, property: string) => {
      const value: string = variable.trim();
      const valueWithinVariableStart: string = value.slice(2, value.length - 1);

      const isVariable: boolean = value.startsWith('${');
      queryParameters.push({
        name: property,
        variable: isVariable ? valueWithinVariableStart : '',
        in: 'query',
        type: getTypeVariable(valueWithinVariableStart, testCaseText).type,
        example: isVariable ? getTypeVariable(valueWithinVariableStart, testCaseText).content : value,
      });
    });

    return queryParameters;
  }
  return [];
};

export const getParameters = ({
  testCaseText,
  textFileTest,
}: {
  testCaseText: string;
  textFileTest: string;
}): parametersType[] => {
  const parameters: parametersType[] = [];
  const regexParameters: RegExp = /\/\$\{(\w*)\}/gi;

  let preventLoop: number = 0;
  while (true) {
    preventLoop += 1;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray = regexParameters.exec(testCaseText);

    if (regexRouter) {
      const nameTag: string = regexRouter[1];

      parameters.push({
        name: nameTag,
        variable: nameTag,
        in: 'param',
        type: getTypeVariable(nameTag, textFileTest).type,
        example: getTypeVariable(nameTag, textFileTest).content,
      });
    }

    if (!regexRouter) {
      break;
    }
  }
  return parameters;
};
