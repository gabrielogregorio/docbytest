export const mergeRecursive = (firstObjectBase: object, obj2Base: object): object => {
  const firstObject: object = firstObjectBase;
  const secondObject: object = obj2Base;
  const itemList: string[] = Object.keys(secondObject);

  itemList.forEach((keySecondObject: string) => {
    try {
      const itemIsObjectOrArray: boolean = [Object, Array].includes(secondObject[keySecondObject].constructor);
      if (itemIsObjectOrArray) {
        firstObject[keySecondObject] = mergeRecursive(firstObject[keySecondObject], secondObject[keySecondObject]);
      } else {
        firstObject[keySecondObject] = secondObject[keySecondObject];
      }
    } catch (error: unknown) {
      const objectHasToBeDefined: boolean = secondObject[keySecondObject] !== null;
      if (objectHasToBeDefined) {
        firstObject[keySecondObject] = secondObject[keySecondObject];
      }
    }
  });

  return firstObject;
};
