import { BIG_SORT_NUMBER } from '../../constants/variables';

const GROUP_TEXT_POSITION: number = 3;
const GROUP_POSITION_ORDER: number = 2;

export type getTitleSuiteType = {
  text: string;
  order: number;
};

type getTitleSuiteTypeType = {
  textFileTest: string;
};

export const getTitleSuite = ({ textFileTest }: getTitleSuiteTypeType): getTitleSuiteType => {
  const regex: RegExp = /describe\(['"`]\s{0,12}(\[\s{0,12}(\d{1,10})?\s{0,12}\]\s{0,12}:?)?\s{0,12}(.*)['"`]/;
  const match: RegExpExecArray | null = regex.exec(textFileTest);
  if (match) {
    return { text: match[GROUP_TEXT_POSITION], order: Number(match[GROUP_POSITION_ORDER]) || BIG_SORT_NUMBER };
  }
  return { text: '', order: BIG_SORT_NUMBER };
};
