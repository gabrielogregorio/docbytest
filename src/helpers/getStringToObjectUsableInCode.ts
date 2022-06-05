import { transformStringToUsableObject } from './transformStringToUsableObject';

export const getStringToObjectUsableInCode = (variable: string, fullCode: string) => {
  const regexItems = new RegExp(`(const|let)\\s*(${variable})\\s+=\\s+([^;)]*)`);
  const matchItems: RegExpExecArray | null = regexItems.exec(fullCode);

  if (matchItems?.[3]) {
    try {
      return transformStringToUsableObject(`${matchItems[3]}`);
    } catch (error2) {
      return '';
    }
  }
  return '';
};
