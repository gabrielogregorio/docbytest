export const getFirstKeyObject = (anyObject: object): object => {
  const keys: string[] = Object.keys(anyObject);
  try {
    const firstItem: string = keys[0];
    return anyObject[firstItem] || anyObject;
  } catch (error: unknown) {
    return anyObject;
  }
};
