import { BIG_SORT_NUMBER } from '../constants/variables';
import { paramsType } from '../interfaces/extractData';
import { getStringToObjectUsableInCode } from './getStringToObjectUsableInCode';
import { transformStringToUsableObject } from './transformStringToUsableObject';

const REGEX_GROUP_STRING = `\\(['"\`](.*?)['"\`]\\)`;

// need created method for get values

export function getResponseExpected(code: string, text: string): any {
  const regex = /expect\([\w]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match = regex.exec(code);
  if (match) {
    try {
      return transformStringToUsableObject(`${match[2]}`);
    } catch (error) {
      return getStringToObjectUsableInCode(match[2], text);
    }
  }
  return '';
}

export function getStatusCodeExpected(code: string): string {
  const regex = /expect\((.*statusCode.*?)\)[\\.\n]*(.*?)\(\s*([\d]{3})\s*\)/;
  const match = regex.exec(code);
  if (match) {
    return match[3];
  }
  return '';
}

export function getSendContent(code: string, text: string): any {
  const regex = /\.send\(([^(\\))]*)/;
  const match: RegExpExecArray | null = regex.exec(code);

  if (match) {
    try {
      return transformStringToUsableObject(`${match[1]}`);
    } catch (error) {
      return getStringToObjectUsableInCode(`${match[1]}`, text);
    }
  }
  return '';
}

export function getHeder(fullBlock: string, text: string) {
  const regex = /\.set\(([^(\\);)]*)/;
  const match: RegExpExecArray | null = regex.exec(fullBlock);

  if (match) {
    const headerContent = match[1];

    try {
      return transformStringToUsableObject(headerContent);
    } catch (error) {
      return getStringToObjectUsableInCode(headerContent, text);
    }
  }
  return '';
}

export function getTypeMethod(code: string): string {
  const regex = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const match = regex.exec(code);
  if (match) {
    return match[1];
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
  const regex = /describe\(['"`]\s{0,12}(\[\s{0,12}(\d{1,10})?\s{0,12}\]\s{0,12}[:]?)?\s{0,12}(.*)['"`]/;
  const match = regex.exec(fullCode);
  if (match) {
    return { text: match[3], order: Number(match[2]) || BIG_SORT_NUMBER };
  }
  return { text: '', order: BIG_SORT_NUMBER };
}

function getBaseToQueryParams(fullCode: string): string {
  const regex = /\(['"`](.*)\?(.{3,})['"`]\)/;
  const match = regex.exec(fullCode);
  if (match) {
    return match[2];
  }
  return '';
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

const regex2 = /([\w-]+)=\$\{(\w+)\}/gi;
export function getQueryParams(fullCode: string): paramsType[] {
  const queries = getBaseToQueryParams(fullCode);
  if (queries) {
    const params: paramsType[] = [];

    // remove this trash loop
    while (true) {
      const regexRouter = regex2.exec(queries);

      if (regexRouter) {
        const nameTag = regexRouter[1];
        const valueVarTag = regexRouter[2];

        params.push({
          tag: nameTag,
          variable: valueVarTag,
          in: 'query',
          required: null,
          type: getTypeVariable(valueVarTag, fullCode).type,
          example: getTypeVariable(valueVarTag, fullCode).content,
        });
      }

      if (!regexRouter) {
        break;
      }
    }

    return params;
  }
  return [];
}

export function getUrlParams(router: string, text: string): any[] {
  const params = [];
  const regex = /\/\$\{([\w]*)\}/gi;

  // remove this while, please
  while (true) {
    const regexRouter = regex.exec(router);

    if (regexRouter) {
      const nameTag = regexRouter[1];

      params.push({
        tag: nameTag,
        variable: nameTag,
        in: 'param',
        required: null,
        type: getTypeVariable(nameTag, text).type,
        example: getTypeVariable(nameTag, text).content,
      });
    }

    if (!regexRouter) {
      break;
    }
  }
  return params;
}
