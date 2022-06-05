/* eslint-disable no-eval */
export function transformStringToUsableObject(anyItem: any) {
  return eval(`(${anyItem})`);
}
