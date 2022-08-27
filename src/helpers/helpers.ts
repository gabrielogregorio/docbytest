import { dynamicAssembly } from './dynamicAssembly';
import { mergeRecursive } from './mergeRecursive';
import { BIG_SORT_NUMBER, LIMIT_PREVENT_INFINITE_LOOPS } from '../constants/variables';
import { paramsType } from '../interfaces/extractData';
import { findValueInCode } from './findValueInCode';

const REGEX_GROUP_STRING: string = `\\(['"\`](.*?)['"\`]\\)`;

export const getExpectedResponse = (
  code: string,
  text: string,
  pathFull: string,
): string | number | boolean | object => {
  const regex: RegExp = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match: RegExpExecArray = regex.exec(code);
  if (match) {
    return findValueInCode(match[2], text, pathFull);
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

export const getExpectedResponseDynamically = (
  code: string,
  oneTestText: string,
  object: object,
  pathFull: string,
): object => {
  let completeObject: object = object;
  const regexDynamicBody: RegExp = /expect\(\w{1,300}\.(body[^)]+)\)\.toEqual\(([^)]{1,9999})/gi;

  for (let increment: number = 0; increment <= LIMIT_PREVENT_INFINITE_LOOPS; increment += 1) {
    const regexRouter: RegExpExecArray = regexDynamicBody.exec(code);

    if (regexRouter) {
      const command: string = regexRouter[1];
      const expectedResponse: string = regexRouter[2];

      const isFunctionFromObject: boolean = !command.endsWith('length');
      if (isFunctionFromObject) {
        try {
          completeObject = mountDynamicObject(expectedResponse, command, completeObject, oneTestText, pathFull);
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

export const getExpectedStatusCode = (code: string): number => {
  const RE_EXPECTED_STATUS_CODE: RegExp =
    /expect\(([\w\d]{1,50}\.statusCode)\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject|toBe)\(\s{0,20}(\d{3})\s{0,20}\)/;

  const matchExpectedStatusCode: RegExpExecArray = RE_EXPECTED_STATUS_CODE.exec(code);
  if (matchExpectedStatusCode) {
    return Number(matchExpectedStatusCode[3]);
  }
  return 0;
};

export const getContentSend = (code: string, text: string, pathFull: string): string | number | boolean | object => {
  const RE_CONTENT_SEND: RegExp = /\.send\(([^))]{1,9999})[\S\s]{0,500}\)[\S\s]{0,500}[;\\.]/;
  const contentSend: RegExpExecArray | null = RE_CONTENT_SEND.exec(code);
  if (contentSend) {
    return findValueInCode(contentSend[1], text, pathFull);
  }
  return '';
};

export const getSentHeader = (
  fullBlock: string,
  text: string,
  pathFull: string,
): string | number | boolean | object => {
  const RE_SEND_HEADER: RegExp = /\.set\(([^(\\);)]*)/;
  const sendHeader: RegExpExecArray | null = RE_SEND_HEADER.exec(fullBlock);

  if (sendHeader) {
    return findValueInCode(sendHeader[1], text, pathFull);
  }
  return '';
};

export const getRequestMethod = (code: string): string => {
  const RE_REQUEST_METHOD: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const requestMethod: RegExpExecArray = RE_REQUEST_METHOD.exec(code);
  if (requestMethod) {
    return requestMethod[1];
  }
  return '';
};

export const getRouterRequest = (code: string): string => {
  const regex: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const match: RegExpExecArray = regex.exec(code);
  if (match) {
    return match[2];
  }
  return '';
};

export const getRouterParams = (code: string): string => {
  const regex: RegExp = /([/\w/{}$]+)*/;
  const match: RegExpExecArray = regex.exec(code);
  if (match) {
    return match[1];
  }

  return '';
};

const removeDocPrefix = (content: string): string => {
  const contentLocal: string = content.replace(/^\s*\[doc\]\s*[:-]\s*/, '');
  return contentLocal.replace(/^\s*\[dev\]\s*[:-]\s*/, '');
};

export const getContentTest = (code: string): string => {
  const regex: RegExp = /(it|test)\(['`"](.*?)['`"]/;
  const match: RegExpExecArray = regex.exec(code);
  if (match) {
    return removeDocPrefix(match[2]);
  }

  return '';
};

export type getContextType = {
  text: string;
  order: number;
};

export const getContext = (fullCode: string): getContextType => {
  const regex: RegExp = /describe\(['"`]\s{0,12}(\[\s{0,12}(\d{1,10})?\s{0,12}\]\s{0,12}:?)?\s{0,12}(.*)['"`]/;
  const match: RegExpExecArray = regex.exec(fullCode);
  if (match) {
    return { text: match[3], order: Number(match[2]) || BIG_SORT_NUMBER };
  }
  return { text: '', order: BIG_SORT_NUMBER };
};

export const getDescriptionLocal = (contextCode: string): string => {
  const regex: RegExp = /(it|test).*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray = regex.exec(contextCode);
  if (match) {
    return match[2].trim();
  }
  return '';
};

export const getFullDescription = (contextCode: string): string => {
  const regex: RegExp = /describe.*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray = regex.exec(contextCode);
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
export const getQueryParams = (fullCode: string): paramsType[] => {
  const matchGetFullUrl: RegExpExecArray = RE_GET_FULL_URL.exec(fullCode);
  const fullUrlRequest: string = matchGetFullUrl?.[1];
  const queryParams: paramsType[] = [];

  if (fullUrlRequest) {
    const urlParsed: URL = new URL(fullUrlRequest, 'http://localhost/');

    const searchParams: URLSearchParams = new URLSearchParams(urlParsed.search);

    searchParams.forEach((value2: string, key: string) => {
      const value: string = value2.trim();
      const valueWithinVariableStart: string = value.slice(2, value.length - 1);

      const isVariable: boolean = value.startsWith('${');
      queryParams.push({
        tag: key,
        variable: isVariable ? valueWithinVariableStart : '',
        in: 'query',
        required: null,
        type: getTypeVariable(valueWithinVariableStart, fullCode).type,
        example: isVariable ? getTypeVariable(valueWithinVariableStart, fullCode).content : value,
      });
    });

    return queryParams;
  }
  return [];
};

export const getUrlParams = (router: string, fullCode: string): paramsType[] => {
  const params: paramsType[] = [];
  const regexParams: RegExp = /\/\$\{(\w*)\}/gi;

  let preventLoop: number = 0;
  while (true) {
    preventLoop += 1;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray = regexParams.exec(router);

    if (regexRouter) {
      const nameTag: string = regexRouter[1];

      params.push({
        tag: nameTag,
        variable: nameTag,
        in: 'param',
        required: null,
        type: getTypeVariable(nameTag, fullCode).type,
        example: getTypeVariable(nameTag, fullCode).content,
      });
    }

    if (!regexRouter) {
      break;
    }
  }
  return params;
};
