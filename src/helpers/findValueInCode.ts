import { resolverJsonFiles } from './resolvers';
import { transformStringToUsableObject } from './transformStringToUsableObject';

export const getStringToObjectUsableInCode = (
  variable: string,
  fullCode: string,
): string | number | boolean | object => {
  const regexItems: RegExp = new RegExp(`(const|let)\\s*(${variable})\\s+=\\s+([^;)]*)`);
  const matchItems: RegExpExecArray | null = regexItems.exec(fullCode);

  return transformStringToUsableObject(`${matchItems[3]}`);
};

export const findValueInCode = (
  value: string,
  fullCode: string,
  pathFull: string,
): string | number | boolean | object => {
  const isStringWithDoubleQuotation: boolean = value.trim().startsWith('"') && value.trim().endsWith('"');
  if (isStringWithDoubleQuotation) {
    return value;
  }

  try {
    return transformStringToUsableObject(`${value}`);
  } catch (error: unknown) {
    //
  }

  try {
    return getStringToObjectUsableInCode(`${value}`, fullCode);
  } catch (error2: unknown) {
    //
  }

  try {
    return resolverJsonFiles(fullCode, value, pathFull).content;
  } catch (error: unknown) {
    //
  }

  return '';
};
