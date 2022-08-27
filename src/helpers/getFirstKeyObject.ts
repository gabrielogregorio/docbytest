const POSITION_FIRST_KEY: number = 0;

export const getFirstKeyObject = (object: object): object => {
  const keys: string[] = Object.keys(object);

  try {
    const firstItem: string = keys[POSITION_FIRST_KEY];
    return object[firstItem] || object;
  } catch (error: unknown) {
    return object;
  }
};
