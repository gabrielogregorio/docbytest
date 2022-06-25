const RE_MOCK_LEVEL = /["']?__DOC_BY_TEST__MOCK_LEVEL__["']?/;
const RE_REMOVE_ARRAY_LEVEL = /\[\d{1,100}\]/;
const RE_GET_LEVEL_ARRAY = /\[(\d{1,100})\]/;
const MOCK_LEVEL = '__DOC_BY_TEST__MOCK_LEVEL__';

function removeArrayLevel(objectItem: string) {
  return objectItem.replace(RE_REMOVE_ARRAY_LEVEL, '');
}

function handleEndArray(arr: string[], getPosition: number, valueHandler) {
  const localArr = arr;
  localArr[getPosition] = valueHandler;
  return JSON.stringify(localArr);
}

function handleStartLevel(hasArrayLevel: boolean, arr: string[], getPosition: number, partObject: string) {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, MOCK_LEVEL);
    return `{ "${removeArrayLevel(partObject)}": ${endArray} }`;
  }
  return `{ "${partObject}": ${MOCK_LEVEL} }`;
}

function handleMediumLevel(
  hasArrayLevel: boolean,
  arr: string[],
  getPosition: number,
  partObject: string,
  stringObjectMounted: string,
) {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, MOCK_LEVEL);
    return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${removeArrayLevel(partObject)}": ${endArray} }`);
  }
  return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${partObject}": ${MOCK_LEVEL} }`);
}

function handleOneLevel(hasArrayLevel: boolean, arr: string[], getPosition: number, value, partObject: string) {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, value);
    return `{ "${removeArrayLevel(partObject)}": ${endArray} }`;
  }
  return `{ "${partObject}": ${value} }`;
}

const handleEndLevel = (
  hasArrayLevel: boolean,
  arr: string[],
  getPosition: number,
  value,
  stringObjectMounted: string,
  partObject: string,
) => {
  if (hasArrayLevel) {
    const endArray = handleEndArray(arr, getPosition, value);
    return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${removeArrayLevel(partObject)}": ${endArray} }`);
  }
  return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${partObject}": ${value} }`);
};

export function dynamicAssembly(fullText: string, value: string | boolean | number | object) {
  const partsOfObject: string[] = fullText.split('.');
  let stringObjectMounted: string = '';

  partsOfObject.forEach((partObject, indexObject) => {
    const objectHasOneLevel = partsOfObject.length === 2;
    const endLevel = indexObject === partsOfObject.length - 1;
    const startLevel = indexObject === 1;
    const hasArrayLevel = partObject.includes('[');

    let getPosition = 0;
    let arr: string[] = [];
    if (hasArrayLevel) {
      const levelArray = RE_GET_LEVEL_ARRAY.exec(partObject);
      getPosition = Number(levelArray[1]);
      arr = new Array(getPosition).fill(null);
    }

    if (objectHasOneLevel) {
      stringObjectMounted = handleOneLevel(hasArrayLevel, arr, getPosition, value, partObject);
    } else if (endLevel) {
      stringObjectMounted = handleEndLevel(hasArrayLevel, arr, getPosition, value, stringObjectMounted, partObject);
    } else if (startLevel) {
      stringObjectMounted = handleStartLevel(hasArrayLevel, arr, getPosition, partObject);
    } else {
      stringObjectMounted = handleMediumLevel(hasArrayLevel, arr, getPosition, partObject, stringObjectMounted);
    }
  });

  return stringObjectMounted;
}
