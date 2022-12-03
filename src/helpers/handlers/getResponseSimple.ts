import { contentRequestType } from '../../interfaces/extractData';
import { findValueInCode } from '../findValueInCode';

const GROUP_POSITION_CONTENT_RESPONSE: number = 2;

export const getResponseSimple = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): contentRequestType => {
  const regex: RegExp = /expect\([\w\\_]*\.body\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject)\(([^(\\);)]*)/;
  const match: RegExpExecArray | null = regex.exec(testCaseText);
  if (match) {
    return findValueInCode(match[GROUP_POSITION_CONTENT_RESPONSE], textFileTest, directoryAllTests);
  }
  return '';
};
