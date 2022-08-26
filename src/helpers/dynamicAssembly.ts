const RE_MOCK_LEVEL = /["']?__DOC_BY_TEST__MOCK_LEVEL__["']?/;
const RE_REMOVE_ARRAY_LEVEL = /\[\d{1,100}\]/;
const RE_GET_LEVEL_ARRAY = /\[(\d{1,100})\]/;
const MOCK_LEVEL = '__DOC_BY_TEST__MOCK_LEVEL__';

const removeArrayLevel = (objectItem: string): string => objectItem.replace(RE_REMOVE_ARRAY_LEVEL, '');

const handleEndArray = (arr: string[], getPosition: number, valueHandler): string => {
  const localArr = arr;
  localArr[getPosition] = valueHandler;
  return JSON.stringify(localArr);
};

function handleStartLevel(hasArrayLevel: boolean, arr: string[], getPosition: number, partObject: string): string {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, MOCK_LEVEL);
    return `{ "${removeArrayLevel(partObject)}": ${endArray} }`;
  }
  return `{ "${partObject}": ${MOCK_LEVEL} }`;
}

const handleMediumLevel = (
  hasArrayLevel: boolean,
  arr: string[],
  getPosition: number,
  partObject: string,
  stringObjectMounted: string,
): string => {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, MOCK_LEVEL);
    return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${removeArrayLevel(partObject)}": ${endArray} }`);
  }
  return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${partObject}": ${MOCK_LEVEL} }`);
};

const handleEndLevel = (
  hasArrayLevel: boolean,
  arr: string[],
  getPosition: number,
  value,
  stringObjectMounted: string,
  partObject: string,
): string => {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, value);

    return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${removeArrayLevel(partObject)}": ${endArray} }`);
  }

  try {
    return stringObjectMounted.replace(
      RE_MOCK_LEVEL,
      `{ "${partObject}": ${typeof value === 'string' ? value : JSON.stringify(value)} }`,
    );
  } catch (error: unknown) {
    return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${partObject}": ${value?.toString()} }`);
  }
};

export const dynamicAssembly = (fullText: string, value: string | boolean | number | object): string => {
  const partsOfObject: string[] = fullText.split('.');
  let stringObjectMounted: string = '';

  partsOfObject.forEach((partObject, indexObject) => {
    const endLevel = indexObject === partsOfObject.length - 1;
    const startLevel = indexObject === 0;
    const hasArrayLevel = partObject.includes('[');

    let getPosition = 0;
    let arr: string[] = [];
    if (hasArrayLevel) {
      const levelArray = RE_GET_LEVEL_ARRAY.exec(partObject);
      getPosition = Number(levelArray[1]);
      arr = new Array(getPosition).fill(null);
    }

    if (startLevel) {
      stringObjectMounted = handleStartLevel(hasArrayLevel, arr, getPosition, partObject);
    } else if (endLevel) {
      stringObjectMounted = handleEndLevel(hasArrayLevel, arr, getPosition, value, stringObjectMounted, partObject);
    } else {
      stringObjectMounted = handleMediumLevel(hasArrayLevel, arr, getPosition, partObject, stringObjectMounted);
    }
  });

  return stringObjectMounted;
};
