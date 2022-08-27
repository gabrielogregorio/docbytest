import { contentRequestType } from '@/interfaces/extractData';

const RE_REMOVE_LAST_COMMA_IN_ARRAYS: RegExp = /]\s*,[\s{0,4}\n]{0,20}\]/g;
const RE_REMOVE_LAST_COMMA_IN_OBJECT: RegExp = /,[\s{0,4}\n]{0,20}\}/g;
const RE_ADD_QUOTES_AROUND_AN_JSON_BRACES: RegExp = /([\w]{1,255})\s{0,100}:\s*/g;
const RE_REPLACE_SINGLE_QUOTES_WITH_DOUBLE: RegExp = /'/g;
const IS_NUMBER: RegExp = /^\d+$/;
const IS_BOOLEAN: RegExp = /(true|false)/;

const convertToBoolean = (value: string): boolean => value === 'true';

const normalizeTextJson = (value: string): object => {
  let jsonObject: string = value.replace(RE_ADD_QUOTES_AROUND_AN_JSON_BRACES, '"$1": ');
  jsonObject = jsonObject.replace(RE_REMOVE_LAST_COMMA_IN_OBJECT, '}');
  jsonObject = jsonObject.replace(RE_REMOVE_LAST_COMMA_IN_ARRAYS, ']]');
  jsonObject = jsonObject.replace(RE_REPLACE_SINGLE_QUOTES_WITH_DOUBLE, '"');

  return JSON.parse(jsonObject);
};

export const transformStringToUsableObject = (textJson: string): contentRequestType => {
  if (IS_BOOLEAN.test(textJson)) {
    return convertToBoolean(textJson);
  }

  if (IS_NUMBER.test(textJson)) {
    return Number(textJson);
  }

  return normalizeTextJson(textJson);
};
