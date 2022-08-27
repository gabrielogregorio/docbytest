export const getFirstKeyObject = (object: object): object => {
  const keys: string[] = Object.keys(object);

  try {
    const firstItem: string = keys[0];
    return object[firstItem] || object;
  } catch (error: unknown) {
    return object;
  }
};
