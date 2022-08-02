import { dynamicAssembly } from './dynamicAssembly';
import { mergeRecursive } from './mergeRecursive';
import { BIG_SORT_NUMBER, LIMIT_PREVENT_INFINITE_LOOPS } from '../constants/variables';
import { paramsType } from '../interfaces/extractData';
import { findValueInCode } from './findValueInCode';

const REGEX_GROUP_STRING = `\\(['"\`](.*?)['"\`]\\)`;

export function getExpectedResponse(code: string, text: string, pathFull: string): any {
  const regex = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match = regex.exec(code);
  if (match) {
    return findValueInCode(match[2], text, pathFull);
  }
  return '';
}

function mountDynamicObject(expectedResponse: string, command: string, completeObject, oneTestText, pathFull: string) {
  let valueExtracted = findValueInCode(expectedResponse.replace(/'/gi, '"'), oneTestText, pathFull);
  if (typeof valueExtracted === 'string' && valueExtracted[0] !== '"') {
    valueExtracted = `"${valueExtracted}"`;
  }
  const transform = dynamicAssembly(command, valueExtracted);

  return mergeRecursive(completeObject, JSON.parse(transform.replace(/'/g, '"')));
}

export function getExpectedResponseDynamically(code: string, oneTestText: string, object, pathFull: string): any {
  let completeObject = object;
  const regexDynamicBody = /expect\(\w{1,300}\.(body[^)]+)\)\.toEqual\(([^)]{1,9999})/gi;

  for (let x = 0; x <= LIMIT_PREVENT_INFINITE_LOOPS; x += 1) {
    const regexRouter = regexDynamicBody.exec(code);

    if (regexRouter) {
      const command = regexRouter[1];
      const expectedResponse = regexRouter[2];

      const isFunctionFromObject = !command.endsWith('length');
      if (isFunctionFromObject) {
        try {
          completeObject = mountDynamicObject(expectedResponse, command, completeObject, oneTestText, pathFull);
        } catch (error) {
          //
        }
      }
    }

    if (!regexRouter) {
      break;
    }
  }

  return completeObject;
}

export function getExpectedStatusCode(code: string): number {
  const RE_EXPECTED_STATUS_CODE =
    /expect\(([\w\d]{1,50}\.statusCode)\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject|toBe)\(\s{0,20}(\d{3})\s{0,20}\)/;

  const matchExpectedStatusCode = RE_EXPECTED_STATUS_CODE.exec(code);
  if (matchExpectedStatusCode) {
    return Number(matchExpectedStatusCode[3]);
  }
  return 0;
}

export function getContentSend(code: string, text: string, pathFull: string): any {
  const RE_CONTENT_SEND = /\.send\(([^))]{1,9999})[\S\s]{0,500}\)[\S\s]{0,500}[;\\.]/;
  const contentSend: RegExpExecArray | null = RE_CONTENT_SEND.exec(code);
  if (contentSend) {
    return findValueInCode(contentSend[1], text, pathFull);
  }
  return '';
}

export function getSentHeader(fullBlock: string, text: string, pathFull: string) {
  const RE_SEND_HEADER = /\.set\(([^(\\);)]*)/;
  const sendHeader: RegExpExecArray | null = RE_SEND_HEADER.exec(fullBlock);

  if (sendHeader) {
    return findValueInCode(sendHeader[1], text, pathFull);
  }
  return '';
}

export function getRequestMethod(code: string): string {
  const RE_REQUEST_METHOD = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const requestMethod = RE_REQUEST_METHOD.exec(code);
  if (requestMethod) {
    return requestMethod[1];
  }
  return '';
}

export function getRouterRequest(code: string): string {
  const regex = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const match = regex.exec(code);
  if (match) {
    return match[2];
  }
  return '';
}

export function getRouterParams(code: string): string {
  const regex = /([/\w/{}$]+)*/;
  const match = regex.exec(code);
  if (match) {
    return match[1];
  }

  return '';
}

function removeDocPrefix(content: string): string {
  const contentLocal = content.replace(/^\s*\[doc\]\s*[:-]\s*/, '');
  return contentLocal.replace(/^\s*\[dev\]\s*[:-]\s*/, '');
}

export function getContentTest(code: string): string {
  const regex = /(it|test)\(['`"](.*?)['`"]/;
  const match = regex.exec(code);
  if (match) {
    return removeDocPrefix(match[2]);
  }

  return '';
}

export function getContext(fullCode: string): { text: string; order: number } {
  const regex = /describe\(['"`]\s{0,12}(\[\s{0,12}(\d{1,10})?\s{0,12}\]\s{0,12}:?)?\s{0,12}(.*)['"`]/;
  const match = regex.exec(fullCode);
  if (match) {
    return { text: match[3], order: Number(match[2]) || BIG_SORT_NUMBER };
  }
  return { text: '', order: BIG_SORT_NUMBER };
}

export function getDescriptionLocal(contextCode: string): string {
  const regex = /(it|test).*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match = regex.exec(contextCode);
  if (match) {
    return match[2].trim();
  }
  return '';
}

export function getFullDescription(contextCode: string): string {
  const regex = /describe.*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match = regex.exec(contextCode);
  if (match) {
    return match[1].trim();
  }
  return '';
}

type getVariable = {
  type: 'number' | 'boolean' | 'string' | 'unknown';
  content: any | null;
};

export function getTypeVariable(variable: string, fullCode: string): getVariable {
  const regexString = new RegExp(`\\s${variable}\\s*\\=\\s*['"\`](.*)['"\`]`);
  const regexNumber = new RegExp(`\\s${variable}\\s*\\=\\s*(\\d+)`);
  const regexBoolean = new RegExp(`\\s${variable}\\s*\\=\\s*(false|true)`);

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
}

const RE_GET_FULL_URL = /\(['"`](.{3,600}?)['"`]\)/;
export function getQueryParams(fullCode: string): paramsType[] {
  const matchGetFullUrl = RE_GET_FULL_URL.exec(fullCode);
  const fullUrlRequest = matchGetFullUrl?.[1];
  const queryParams = [];

  if (fullUrlRequest) {
    const urlParsed = new URL(fullUrlRequest, 'http://localhost/');

    const searchParams = new URLSearchParams(urlParsed.search);

    searchParams.forEach((value2, key) => {
      const value = value2.trim();
      const valueWithinVariableStart = value.slice(2, value.length - 1);

      const isVariable = value.startsWith('${');
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
}

export function getUrlParams(router: string, fullCode: string): any[] {
  const params = [];
  const regexParams = /\/\$\{(\w*)\}/gi;

  let preventLoop = 0;
  while (true) {
    preventLoop += 1;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter = regexParams.exec(router);

    if (regexRouter) {
      const nameTag = regexRouter[1];

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
}
