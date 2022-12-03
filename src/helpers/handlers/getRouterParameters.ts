import { REGEX_GROUP_STRING } from '../../constants/variables';

const GROUP_POSITION_ROUTER: number = 2;
const GROUP_POSITION_ROUTER_INSIDE: number = 1;

export const getRouterParameters = ({ testCaseText }: { testCaseText: string }): string => {
  const regex1: RegExp = new RegExp(`\\.(get|post|put|delete)${REGEX_GROUP_STRING}`);
  const match1: RegExpExecArray | null = regex1.exec(testCaseText);
  if (match1) {
    const router: string = match1[GROUP_POSITION_ROUTER];
    const regex: RegExp = /([/\w/{}$]+)*/;
    const match: RegExpExecArray | null = regex.exec(router);
    if (match) {
      return match[GROUP_POSITION_ROUTER_INSIDE];
    }
  }
  return '';
};
