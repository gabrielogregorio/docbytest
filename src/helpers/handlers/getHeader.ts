import { contentRequestType } from '../../interfaces/extractData';
import { findValueInCode } from '../findValueInCode';

const GROUP_POSITION_HEADER: number = 1;

type getHeaderType = {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
};

export const getHeader = ({ testCaseText, textFileTest, directoryAllTests }: getHeaderType): contentRequestType => {
  const RE_SEND_HEADER: RegExp = /\.set\(([^(\\);)]*)/;
  const sendHeader: RegExpExecArray | null = RE_SEND_HEADER.exec(testCaseText);

  if (sendHeader) {
    return findValueInCode(sendHeader[GROUP_POSITION_HEADER], textFileTest, directoryAllTests);
  }
  return '';
};
