import { contentRequestType } from '@/interfaces/extractData';

const POSITION_FIRST_KEY: number = 0;

export const getFirstKeyObject = (object: contentRequestType): contentRequestType => {
  const keys: string[] = Object.keys(object);

  try {
    const firstItem: string = keys[POSITION_FIRST_KEY];
    // @ts-ignore
    return object[firstItem] || object;
  } catch (error: unknown) {
    return object;
  }
};
