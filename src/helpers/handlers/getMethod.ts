import { REGEX_GROUP_STRING } from '../../constants/variables';

const GROUP_METHOD_POSITION: number = 1;

type getMethodType = {
  testCaseText: string;
};

export const getMethod = ({ testCaseText }: getMethodType): string => {
  const RE_REQUEST_METHOD: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const requestMethod: RegExpExecArray | null = RE_REQUEST_METHOD.exec(testCaseText);
  if (requestMethod) {
    return requestMethod[GROUP_METHOD_POSITION];
  }
  return '';
};
