/* eslint-disable no-eval */
const REGEX_GROUP_STRING = `\\(['|"|\`](.*?)['|"|\`]\\)`;

export function getResponseExpected(code: any) {
  const regex = /expect\([a-zA-Z0-9_]*\.body\)\.(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match = regex.exec(code);
  if (match) {
    try {
      // @ts-ignore
      return eval(`(${match[2].replaceAll('\n', '')})`);
    } catch (error) {
      return '';
    }
  }
  return '';
}

export function getStatusCodeExpected(code: string): string {
  const regex = /expect\((.*statusCode.*?)\)\.(.*?)\(\s*([\d]{3})\s*\)/;
  const match = regex.exec(code);
  if (match) {
    return match[3];
  }
  return '';
}

export function getSendContent(code: string): any {
  const regex = /\.send\(\{([^}]*)/;
  const match: RegExpExecArray | null = regex.exec(code);

  if (match) {
    try {
      // @ts-ignore
      return eval(`({${match[1].replaceAll('\n', '')}})`);
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

export function getContentTest(code: string): string {
  const regex = /[it|test]\(['"](.*?)['"]/;
  const match = regex.exec(code);
  if (match) {
    return match[1];
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

export function getDescriptionLocal(contextCode: string): string {
  const regex = /\/\/\s*doc.description:\s*"([^"]{1,})/;
  const match = regex.exec(contextCode);
  if (match) {
    return match[1];
  }
  return '';
}

export function getFullDescription(contextCode: string): string {
  const regex = /describe\(['|"].*?['|"]\s*,\s*\(\)\s*=>\s*\{\n\s*\/\/\s*doc.description:\s*"([^"]{1,})/;
  const match = regex.exec(contextCode);
  if (match) {
    return match[1];
  }
  return '';
}

type getVariable = {
  type: 'number' | 'boolean' | 'string' | 'unknown';
  content: any | null;
};

export function getTypeVariable(variable: string, fullCode: string): getVariable {
  const regexString = new RegExp(`\\s${variable}\\s*\\=\\s*(\\'(.*))\\'`);
  const regexNumber = new RegExp(`\\s${variable}\\s*\\=\\s*(\\d{1,})`);
  const regexBoolean = new RegExp(`\\s${variable}\\s*\\=\\s*(false|true)`);

  if (regexString.exec(fullCode)) {
    return { type: 'string', content: regexString.exec(fullCode)?.[1] };
  }

  if (regexNumber.exec(fullCode)) {
    return { type: 'number', content: regexNumber.exec(fullCode)?.[1] };
  }

  if (regexBoolean.exec(fullCode)) {
    return { type: 'boolean', content: regexBoolean.exec(fullCode)?.[1] };
  }

  return { type: 'unknown', content: '' };
}
