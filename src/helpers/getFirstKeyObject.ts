export const getFirstKeyObject = (anyObject: object): object => {
  const keys = Object.keys(anyObject);
  try {
    const firstItem = keys[0];
    return anyObject[firstItem] || anyObject;
  } catch (error: unknown) {
    return anyObject;
  }
};
