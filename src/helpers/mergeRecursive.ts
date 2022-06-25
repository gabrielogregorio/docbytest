export function mergeRecursive(firstObjectBase: object, obj2Base: object) {
  const firstObject = firstObjectBase;
  const secondObject = obj2Base;
  const itemList = Object.keys(secondObject);

  itemList.forEach((keySecondObject) => {
    try {
      const itemIsObjectOrArray = [Object, Array].includes(secondObject[keySecondObject].constructor);
      if (itemIsObjectOrArray) {
        firstObject[keySecondObject] = mergeRecursive(firstObject[keySecondObject], secondObject[keySecondObject]);
      } else {
        firstObject[keySecondObject] = secondObject[keySecondObject];
      }
    } catch (error) {
      const objectHasToBeDefined = secondObject[keySecondObject] !== null;
      if (objectHasToBeDefined) {
        firstObject[keySecondObject] = secondObject[keySecondObject];
      }
    }
  });

  return firstObject;
}
