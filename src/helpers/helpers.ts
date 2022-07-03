import { dynamicAssembly } from './dynamicAssembly';
import { mergeRecursive } from './mergeRecursive';
import { BIG_SORT_NUMBER, LIMIT_PREVENT_INFINITE_LOOPS } from '../constants/variables';
import { paramsType } from '../interfaces/extractData';
import { getStringToObjectUsableInCode } from './getStringToObjectUsableInCode';
import { transformStringToUsableObject } from './transformStringToUsableObject';

const REGEX_GROUP_STRING = `\\(['"\`](.*?)['"\`]\\)`;

export function extractValueFromCode(value: string, fullCode: string) {
  const isStringWithDoubleQuotation = value.trim().startsWith('"') && value.trim().endsWith('"');
  if (isStringWithDoubleQuotation) {
    return value;
  }

  try {
    return transformStringToUsableObject(`${value}`);
  } catch (error) {
    return getStringToObjectUsableInCode(`${value}`, fullCode);
  }
}
export function getResponseExpected(code: string, text: string): any {
  const regex = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match = regex.exec(code);
  if (match) {
    return extractValueFromCode(match[2], text);
  }
  return '';
}

const regexDynamicBody = /expect\(\w{1,300}\.(body[^)]+)\)\.toEqual\(([^)]{1,9999})/gi;

export function getResponseExpectedMountBody(code: string, oneTestText: string, object): any {
  let response = null;

  let preventLoop = 0;
  while (true) {
    preventLoop += 1;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter = regexDynamicBody.exec(code);

    if (regexRouter) {
      const nameTag = regexRouter[1];
      const valueVarTag = regexRouter[2];

      if (!nameTag.endsWith('length')) {
        try {
          let valueExtracted = extractValueFromCode(valueVarTag.replace(/'/gi, '"'), oneTestText);
          if (typeof valueExtracted === 'string' && valueExtracted[0] !== '"') {
            valueExtracted = `"${valueExtracted}"`;
          }
          const transform = dynamicAssembly(nameTag, valueExtracted);

          response = mergeRecursive(object, JSON.parse(transform.replace(/'/g, '"')));
        } catch (error) {
          //
        }
      }
    }

    if (!regexRouter) {
      break;
    }
  }

  return response;
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
  const regex = /\.send\(([^))]{1,9999})[\n\s]{0,100}\)[\n\s]{0,100}[;\\.]{0,1}/;
  const match: RegExpExecArray | null = regex.exec(code);

  if (match) {
    return extractValueFromCode(match[1], text);
  }
  return '';
}

export function getHeder(fullBlock: string, text: string) {
  const regex = /\.set\(([^(\\);)]*)/;
  const match: RegExpExecArray | null = regex.exec(fullBlock);

  if (match) {
    const headerContent = match[1];

    return extractValueFromCode(headerContent, text);
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

    let preventLoop = 0;
    while (true) {
      preventLoop += 1;
      if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
        break;
      }

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

  let preventLoop = 0;
  while (true) {
    preventLoop += 1;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

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
