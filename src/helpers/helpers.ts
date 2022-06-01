import { paramsType } from 'src/interfaces/extractData';

/* eslint-disable no-eval */
const REGEX_GROUP_STRING = `\\(['"\`](.*?)['"\`]\\)`;

// need remove eval
// need created method for get values

export function getResponseExpected(code: string): any {
  const regex = /expect\([\w]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match = regex.exec(code);
  if (match) {
    try {
      return eval(`(${match[2]?.replaceAll('\n', '')})`);
    } catch (error) {
      return '';
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

export function getSendContent(code: string): any {
  const regex = /\.send\(([^(\\))]*)/;
  const match: RegExpExecArray | null = regex.exec(code);

  if (match) {
    try {
      return eval(`(${match[1]?.replaceAll('\n', '')})`);
    } catch (error) {
      return '';
    }
  }
  return '';
}

export function getHeder(fullBlock: string) {
  const regex = /\.set\(([^(\\);)]*)/;
  const match: RegExpExecArray | null = regex.exec(fullBlock);

  if (match) {
    try {
      return eval(`(${match[1]?.replaceAll('\n', '')})`);
    } catch (error) {
      return '';
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

export function getBaseRouterRequest(code: string): string {
  const regex = /\.(get|post|put|delete)\(['"`](\/[\w]+)/;
  const match = regex.exec(code);
  if (match) {
    return match[2];
  }
  return '';
}

export function getContentTest(code: string): string {
  const regex = /it\(['`"](.*?)['`"]/;
  const match = regex.exec(code);
  if (match) {
    return match[1];
  }

  const regex3 = /test\(['"](.*?)['"]/;
  const match2 = regex3.exec(code);
  if (match2) {
    return match2[1];
  }

  return '';
}

export function getContext(fullCode: string): string {
  const regex = /describe\('(.*)'/;
  const match = regex.exec(fullCode);
  if (match) {
    return match[1];
  }
  return '';
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
  const regex = /\/\/\s*doc.description:\s*"([^"]+)/;
  const match = regex.exec(contextCode);
  if (match) {
    return match[1];
  }
  return '';
}

export function getFullDescription(contextCode: string): string {
  const regex = /describe\(['|"].*?['|"]\s*,\s*\(\)\s*=>\s*\{\n\s*\/\/\s*doc.description:\s*"([^"]+)/;
  const match = regex.exec(contextCode);
  if (match) {
    return match[1];
  }
  return '';
}

export function getFullDescribe(contextCode: string): { code: string; title: string } {
  const regex = /describe\(['|"](.*?)['|"].*\n((.*\n)+?)[$\\)};]/;
  const match = regex.exec(contextCode);
  if (match) {
    return { code: match[2], title: match[1] };
  }
  return { code: '', title: '' };
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
