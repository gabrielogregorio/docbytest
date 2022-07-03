import { getStringToObjectUsableInCode } from './getStringToObjectUsableInCode';
import { transformStringToUsableObject } from './transformStringToUsableObject';

export const findValueInCode = (value: string, fullCode: string) => {
  const isStringWithDoubleQuotation = value.trim().startsWith('"') && value.trim().endsWith('"');
  if (isStringWithDoubleQuotation) {
    return value;
  }

  try {
    return transformStringToUsableObject(`${value}`);
  } catch (error) {
    return getStringToObjectUsableInCode(`${value}`, fullCode);
  }
};
