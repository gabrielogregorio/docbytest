import { contentRequestType } from '../../interfaces/extractData';
import { findValueInCode } from '../findValueInCode';

const GROUP_VALUE_POSITION_SEND_CONTENT: number = 1;

type getContentSendTestCaseType = {
  testCaseText: string;
  textFileTest: string;
  directoryAllTests: string;
};

export const getContentSendTestCase = ({
  testCaseText,
  textFileTest,
  directoryAllTests,
}: getContentSendTestCaseType): contentRequestType => {
  const RE_CONTENT_SEND: RegExp = /\.send\(([^))]{1,9999})[\S\s]{0,500}\)[\S\s]{0,500}[;\\.]/;
  const contentSend: RegExpExecArray | null = RE_CONTENT_SEND.exec(testCaseText);
  if (contentSend) {
    return findValueInCode(contentSend[GROUP_VALUE_POSITION_SEND_CONTENT], textFileTest, directoryAllTests);
  }
  return '';
};
