export const mergeRecursive = (firstObjectBase: object, obj2Base: object): object => {
  const firstObject: object = firstObjectBase;
  const secondObject: object = obj2Base;
  const itemList: string[] = Object.keys(secondObject);

  itemList.forEach((keySecondObject: string) => {
    try {
      // @ts-ignore
      const itemIsObjectOrArray: boolean = [Object, Array].includes(secondObject[keySecondObject].constructor);
      if (itemIsObjectOrArray) {
        // @ts-ignore
        firstObject[keySecondObject] = mergeRecursive(firstObject[keySecondObject], secondObject[keySecondObject]);
      } else {
        // @ts-ignore
        firstObject[keySecondObject] = secondObject[keySecondObject];
      }
    } catch (error: unknown) {
      // @ts-ignore
      const objectHasToBeDefined: boolean = secondObject[keySecondObject] !== null;
      if (objectHasToBeDefined) {
        // @ts-ignore
        firstObject[keySecondObject] = secondObject[keySecondObject];
      }
    }
  });

  return firstObject;
};
