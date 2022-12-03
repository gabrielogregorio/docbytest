import { contentRequestType } from '../../interfaces/extractData';
import { findValueInCode } from '../findValueInCode';

const GROUP_POSITION_HEADER: number = 1;
export const getHeader = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
}): contentRequestType => {
  const RE_SEND_HEADER: RegExp = /\.set\(([^(\\);)]*)/;
  const sendHeader: RegExpExecArray | null = RE_SEND_HEADER.exec(testCaseText);

  if (sendHeader) {
    return findValueInCode(sendHeader[GROUP_POSITION_HEADER], textFileTest, directoryAllTests);
  }
  return '';
};
