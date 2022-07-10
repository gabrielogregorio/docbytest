const RE_REMOVE_LAST_COMMA_IN_ARRAYS = /]\s*,[\s{0,4}\n]{0,20}\]/g;
const RE_REMOVE_LAST_COMMA_IN_OBJECT = /,[\s{0,4}\n]{0,20}\}/g;
const RE_ADD_QUOTES_AROUND_AN_JSON_BRACES = /([\w]{1,255})\s{0,100}:\s*/g;
const RE_REPLACE_SINGLE_QUOTES_WITH_DOUBLE = /'/g;
const IS_NUMBER = /^\d+$/;
const IS_BOOLEAN = /(true|false)/;

function convertToBoolean(value: string): boolean {
  return value === 'true';
}

function normalizeTextJson(value: string): object {
  let jsonObject = value.replace(RE_ADD_QUOTES_AROUND_AN_JSON_BRACES, '"$1": ');
  jsonObject = jsonObject.replace(RE_REMOVE_LAST_COMMA_IN_OBJECT, '}');
  jsonObject = jsonObject.replace(RE_REMOVE_LAST_COMMA_IN_ARRAYS, ']]');
  jsonObject = jsonObject.replace(RE_REPLACE_SINGLE_QUOTES_WITH_DOUBLE, '"');

  return JSON.parse(jsonObject);
}

export function transformStringToUsableObject(textJson: string): string | number | boolean | object {
  if (IS_BOOLEAN.test(textJson)) {
    return convertToBoolean(textJson);
  }

  if (IS_NUMBER.test(textJson)) {
    return Number(textJson);
  }

  return normalizeTextJson(textJson);
}
