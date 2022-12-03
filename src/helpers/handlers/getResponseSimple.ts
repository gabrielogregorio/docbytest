import { findValueInCode } from '@/helpers/findValueInCode';
import { contentRequestType } from '@/interfaces/extractData';

const GROUP_POSITION_CONTENT_RESPONSE: number = 2;

type getResponseSimpleType = {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
};

export const getResponseSimple = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: getResponseSimpleType): contentRequestType => {
  const regex: RegExp = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match: RegExpExecArray | null = regex.exec(testCaseText);
  if (match) {
    return findValueInCode(match[GROUP_POSITION_CONTENT_RESPONSE], textFileTest, directoryAllTests);
  }
  return '';
};
