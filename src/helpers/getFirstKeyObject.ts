export const getFirstKeyObject = (anyObject: object) => {
  const keys = Object.keys(anyObject);
  try {
    const firstItem = keys[0];
    return anyObject[firstItem] || anyObject;
  } catch (error) {
    return anyObject;
  }
};
