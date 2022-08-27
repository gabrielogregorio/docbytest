import { dynamicAssembly } from './dynamicAssembly';
import { mergeRecursive } from './mergeRecursive';
import { BIG_SORT_NUMBER, LIMIT_PREVENT_INFINITE_LOOPS } from '../constants/variables';
import { contentRequestType, IParameters, parametersExampleType, parametersInEnum } from '../interfaces/extractData';
import { findValueInCode } from './findValueInCode';

const REGEX_GROUP_STRING: string = `\\(['"\`](.*?)['"\`]\\)`;

const GROUP_POSITION_CONTENT_RESPONSE: number = 2;

export const getResponseSimple = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): contentRequestType => {
  const regex: RegExp = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return findValueInCode(match[GROUP_POSITION_CONTENT_RESPONSE], textFileTest, directoryAllTests);
  }
  return '';
};

const START_POSITION: number = 0;

const mountDynamicObject = (
  expectedResponse: string,
  command: string,
  completeObject: object,
  oneTestText: string,
  pathFull: string,
): object => {
  let valueExtracted: contentRequestType = findValueInCode(expectedResponse.replace(/'/gi, '"'), oneTestText, pathFull);
  if (typeof valueExtracted === 'string' && valueExtracted[START_POSITION] !== '"') {
    valueExtracted = `"${valueExtracted}"`;
  }
  const transform: string = dynamicAssembly(command, valueExtracted);

  return mergeRecursive(completeObject, JSON.parse(transform.replace(/'/g, '"')));
};

const INCREMENT_DYNAMIC_POSITION: number = 1;
const GROUP_COMMAND_POSITION: number = 1;
const GROUP_VALUE_POSITION: number = 2;
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

  for (let increment: number = 0; increment <= LIMIT_PREVENT_INFINITE_LOOPS; increment += INCREMENT_DYNAMIC_POSITION) {
    const regexRouter: RegExpExecArray = regexDynamicBody.exec(testCaseText);

    if (regexRouter) {
      const command: string = regexRouter[GROUP_COMMAND_POSITION];
      const expectedResponse: string = regexRouter[GROUP_VALUE_POSITION];

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
        } catch (error: unknown) {}
      }
    }

    if (!regexRouter) {
      break;
    }
  }

  return completeObject;
};

const DEFAULT_STATUS_CODE: number = 0;
const GROUP_STATUS_CODE_POSITION: number = 3;
export const getStatusCode = ({ testCaseText }: { testCaseText: string }): number => {
  const RE_EXPECTED_STATUS_CODE: RegExp =
    /expect\(([\w\d]{1,50}\.statusCode)\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject|toBe)\(\s{0,20}(\d{3})\s{0,20}\)/;

  const matchExpectedStatusCode: RegExpExecArray = RE_EXPECTED_STATUS_CODE.exec(testCaseText);
  if (matchExpectedStatusCode) {
    return Number(matchExpectedStatusCode[GROUP_STATUS_CODE_POSITION]);
  }
  return DEFAULT_STATUS_CODE;
};

const GROUP_VALUE_POSITION_SEND_CONTENT: number = 1;
export const getContentSendTestCase = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): contentRequestType => {
  const RE_CONTENT_SEND: RegExp = /\.send\(([^))]{1,9999})[\S\s]{0,500}\)[\S\s]{0,500}[;\\.]/;
  const contentSend: RegExpExecArray | null = RE_CONTENT_SEND.exec(testCaseText);
  if (contentSend) {
    return findValueInCode(contentSend[GROUP_VALUE_POSITION_SEND_CONTENT], textFileTest, directoryAllTests);
  }
  return '';
};

const GROUP_POSITION_HEADER: number = 1;
export const getHeader = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): contentRequestType => {
  const RE_SEND_HEADER: RegExp = /\.set\(([^(\\);)]*)/;
  const sendHeader: RegExpExecArray | null = RE_SEND_HEADER.exec(testCaseText);

  if (sendHeader) {
    return findValueInCode(sendHeader[GROUP_POSITION_HEADER], textFileTest, directoryAllTests);
  }
  return '';
};

const GROUP_METHOD_POSITION: number = 1;
export const getMethod = ({ testCaseText }: { testCaseText: string }): string => {
  const RE_REQUEST_METHOD: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const requestMethod: RegExpExecArray = RE_REQUEST_METHOD.exec(testCaseText);
  if (requestMethod) {
    return requestMethod[GROUP_METHOD_POSITION];
  }
  return '';
};

const GROUP_POSITION_ROUTER: number = 2;
const GROUP_POSITION_ROUTER_INSIDE: number = 1;

export const getRouterParameters = ({ testCaseText }: { testCaseText: string }): string => {
  const regex1: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const match1: RegExpExecArray = regex1.exec(testCaseText);
  if (match1) {
    const router: string = match1[GROUP_POSITION_ROUTER];
    const regex: RegExp = /([/\w/{}$]+)*/;
    const match: RegExpExecArray = regex.exec(router);
    if (match) {
      return match[GROUP_POSITION_ROUTER_INSIDE];
    }
  }
  return '';
};

const removeDocPrefix = (content: string): string => content.replace(/^\s*\[doc\]\s*[:-]\s*/, '');

const GROUP_POSITION_NAME_TEST: number = 2;
export const getNameTest = ({ testCaseText }: { testCaseText: string }): string => {
  const regex: RegExp = /(it|test)\(['`"](.*?)['`"]/;
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return removeDocPrefix(match[GROUP_POSITION_NAME_TEST]);
  }

  return '';
};

export type getTitleSuiteType = {
  text: string;
  order: number;
};

const GROUP_TEXT_POSITION: number = 3;
const GROUP_POSITION_ORDER: number = 2;
export const getTitleSuite = ({ textFileTest }: { textFileTest: string }): getTitleSuiteType => {
  const regex: RegExp = /describe\(['"`]\s{0,12}(\[\s{0,12}(\d{1,10})?\s{0,12}\]\s{0,12}:?)?\s{0,12}(.*)['"`]/;
  const match: RegExpExecArray = regex.exec(textFileTest);
  if (match) {
    return { text: match[GROUP_TEXT_POSITION], order: Number(match[GROUP_POSITION_ORDER]) || BIG_SORT_NUMBER };
  }
  return { text: '', order: BIG_SORT_NUMBER };
};

const GROUP_POSITION_DESCRIPTION: number = 2;
export const getDescriptionTest = ({ testCaseText }: { testCaseText: string }): string => {
  const regex: RegExp = /(it|test).*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray = regex.exec(testCaseText);
  if (match) {
    return match[GROUP_POSITION_DESCRIPTION].trim();
  }
  return '';
};

const GROUP_POSITION_DESCRIBE_SUITE: number = 1;
export const getDescriptionSuite = ({ textFileTest }: { textFileTest: string }): string => {
  const regex: RegExp = /describe.*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray = regex.exec(textFileTest);
  if (match) {
    return match[GROUP_POSITION_DESCRIBE_SUITE].trim();
  }
  return '';
};

export type getVariable = {
  type: 'number' | 'boolean' | 'string' | 'unknown';
  content: parametersExampleType;
};

const GROUP_POSITION_VALUE_VARIABLE: number = 1;
export const getTypeVariable = (variable: string, fullCode: string): getVariable => {
  const regexString: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*['"\`](.*)['"\`]`);
  const regexNumber: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*(\\d+)`);
  const regexBoolean: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*(false|true)`);

  if (regexString.exec(fullCode)) {
    return { type: 'string', content: regexString.exec(fullCode)?.[GROUP_POSITION_VALUE_VARIABLE]?.toString() };
  }

  if (regexNumber.exec(fullCode)) {
    return { type: 'number', content: Number(regexNumber.exec(fullCode)?.[GROUP_POSITION_VALUE_VARIABLE].toString()) };
  }

  if (regexBoolean.exec(fullCode)) {
    return {
      type: 'boolean',
      content: regexBoolean.exec(fullCode)?.[GROUP_POSITION_VALUE_VARIABLE]?.toString() === 'true',
    };
  }

  return { type: 'unknown', content: '' };
};

const RE_GET_FULL_URL: RegExp = /\(['"`](.{3,600}?)['"`]\)/;
const GROUP_POSITION_TEXT_INSIDE_URL: number = 1;
export const getQueryParameters = ({ testCaseText }: { testCaseText: string }): IParameters[] => {
  const matchGetFullUrl: RegExpExecArray = RE_GET_FULL_URL.exec(testCaseText);
  const fullUrlRequest: string = matchGetFullUrl?.[GROUP_POSITION_TEXT_INSIDE_URL];
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
        in: parametersInEnum.query,
        type: getTypeVariable(valueWithinVariableStart, testCaseText).type,
        example: isVariable ? getTypeVariable(valueWithinVariableStart, testCaseText).content : value,
      });
    });

    return queryParameters;
  }
  return [];
};

const INCREMENT_PREVENT_LOOP: number = 1;
const GROUP_POSITION_NAME_TAG: number = 1;
export const getParameters = ({
  testCaseText,
  textFileTest,
}: {
  testCaseText: string;
  textFileTest: string;
}): IParameters[] => {
  const parameters: IParameters[] = [];
  const regexParameters: RegExp = /\/\$\{(\w*)\}/gi;

  let preventLoop: number = 0;
  while (true) {
    preventLoop += INCREMENT_PREVENT_LOOP;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray = regexParameters.exec(testCaseText);

    if (regexRouter) {
      const nameTag: string = regexRouter[GROUP_POSITION_NAME_TAG];

      parameters.push({
        name: nameTag,
        variable: nameTag,
        in: parametersInEnum.param,
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
