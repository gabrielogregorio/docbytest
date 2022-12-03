import { parametersExampleType } from '@/interfaces/extractData';

export type getVariable = {
  type: 'number' | 'boolean' | 'string' | 'unknown';
  content: parametersExampleType;
};

const GROUP_POSITION_VALUE_VARIABLE: number = 1;
export const getTypeVariable = (variable: string, fullCode: string): getVariable => {
  const regexString: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*['"\`](.*)['"\`]`);
  const regexNumber: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*(\\d+)`);
  const regexBoolean: RegExp = new RegExp(`\\s${variable}\\s*\\=\\s*(false|true)`);

  if (regexString.exec(fullCode)) {
    return { type: 'string', content: regexString.exec(fullCode)?.[GROUP_POSITION_VALUE_VARIABLE]?.toString() || '' };
  }

  if (regexNumber.exec(fullCode)) {
    return { type: 'number', content: Number(regexNumber.exec(fullCode)?.[GROUP_POSITION_VALUE_VARIABLE].toString()) };
  }

  if (regexBoolean.exec(fullCode)) {
    return {
      type: 'boolean',
      content: regexBoolean.exec(fullCode)?.[GROUP_POSITION_VALUE_VARIABLE]?.toString() === 'true',
    };
  }

  return { type: 'unknown', content: '' };
};
