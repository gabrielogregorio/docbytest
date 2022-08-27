import { contentRequestType } from '@/interfaces/extractData';

const RE_MOCK_LEVEL: RegExp = /["']?__DOC_BY_TEST__MOCK_LEVEL__["']?/;
const RE_REMOVE_ARRAY_LEVEL: RegExp = /\[\d{1,100}\]/;
const RE_GET_LEVEL_ARRAY: RegExp = /\[(\d{1,100})\]/;
const MOCK_LEVEL: string = '__DOC_BY_TEST__MOCK_LEVEL__';

const removeArrayLevel = (objectItem: string): string => objectItem.replace(RE_REMOVE_ARRAY_LEVEL, '');

const handleEndArray = (arr: string[], getPosition: number, valueHandler: contentRequestType): string => {
  const localArr: unknown[] = arr;
  localArr[getPosition] = valueHandler;
  return JSON.stringify(localArr);
};

const handleStartLevel = (hasArrayLevel: boolean, arr: string[], getPosition: number, partObject: string): string => {
  if (hasArrayLevel) {
    const endArray: string = handleEndArray(arr, getPosition, MOCK_LEVEL);
    return `{ "${removeArrayLevel(partObject)}": ${endArray} }`;
  }
  return `{ "${partObject}": ${MOCK_LEVEL} }`;
};

const handleMediumLevel = (
  hasArrayLevel: boolean,
  arr: string[],
  getPosition: number,
  partObject: string,
  stringObjectMounted: string,
): string => {
  if (hasArrayLevel) {
    const endArray: string = handleEndArray(arr, getPosition, MOCK_LEVEL);
    return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${removeArrayLevel(partObject)}": ${endArray} }`);
  }
  return stringObjectMounted.replace(RE_MOCK_LEVEL, `{ "${partObject}": ${MOCK_LEVEL} }`);
};

const handleEndLevel = (
  hasArrayLevel: boolean,
  arr: string[],
  getPosition: number,
  value: contentRequestType,
  stringObjectMounted: string,
  partObject: string,
): string => {
  if (hasArrayLevel) {
    const endArray: string = handleEndArray(arr, getPosition, value);

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

const DECREMENT_LAST_POSITION: number = 1;
const FIRST_LEVEL: number = 0;
const FIRST_POSITION_REGEX: number = 1;
export const dynamicAssembly = (fullText: string, value: contentRequestType): string => {
  const partsOfObject: string[] = fullText.split('.');
  let stringObjectMounted: string = '';

  partsOfObject.forEach((partObject: string, indexObject: number) => {
    const endLevel: boolean = indexObject === partsOfObject.length - DECREMENT_LAST_POSITION;
    const startLevel: boolean = indexObject === FIRST_LEVEL;
    const hasArrayLevel: boolean = partObject.includes('[');

    let getPosition: number = 0;
    let arr: string[] = [];
    if (hasArrayLevel) {
      const levelArray: RegExpExecArray = RE_GET_LEVEL_ARRAY.exec(partObject);
      getPosition = Number(levelArray[FIRST_POSITION_REGEX]);
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
