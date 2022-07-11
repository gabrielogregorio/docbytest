import { resolverJsonFiles } from './resolvers';
import { transformStringToUsableObject } from './transformStringToUsableObject';

export const getStringToObjectUsableInCode = (variable: string, fullCode: string) => {
  const regexItems = new RegExp(`(const|let)\\s*(${variable})\\s+=\\s+([^;)]*)`);
  const matchItems: RegExpExecArray | null = regexItems.exec(fullCode);

  return transformStringToUsableObject(`${matchItems[3]}`);
};

export const findValueInCode = (value: string, fullCode: string, pathFull: string) => {
  const isStringWithDoubleQuotation = value.trim().startsWith('"') && value.trim().endsWith('"');
  if (isStringWithDoubleQuotation) {
    return value;
  }

  try {
    return transformStringToUsableObject(`${value}`);
  } catch (error) {
    //
  }

  try {
    return getStringToObjectUsableInCode(`${value}`, fullCode);
  } catch (error2) {
    //
  }

  try {
    return resolverJsonFiles(fullCode, value, pathFull).content;
  } catch (error) {
    //
  }

  return '';
};
