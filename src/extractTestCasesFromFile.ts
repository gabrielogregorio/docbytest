import { ITestCase, IParameters, contentRequestType } from './interfaces/extractData';

import {
  getResponseSimple,
  getMethod,
  getContentSendTestCase,
  getStatusCode,
  getTitleSuite,
  getParameters,
  getNameTest,
  getDescriptionTest,
  getDescriptionSuite,
  getQueryParameters,
  getHeader,
  getRouterParameters,
  getResponseDynamically,
  getTitleSuiteType,
} from './helpers/helpers';
import { getFirstKeyObject } from './helpers/getFirstKeyObject';

const removeTestCaseExtracted = ({
  completeTextFileText,
  textNextTestCase,
}: {
  completeTextFileText: string;
  textNextTestCase: RegExpExecArray;
}): string => completeTextFileText.replace(textNextTestCase[0], '');

const removeBreakLines = ({ completeTextFileText }: { completeTextFileText: string }): string =>
  completeTextFileText.replace(/^.{0,300}\n/, '');

const testesTwoSpaceLines: RegExp = /^^\s{2}(it|test)\(['"`]\s{0,10}\[doc\]\s{0,10}[:-][\s\S]+?\n\s{2}\}\);\n/;

const extractTestCasesText = ({ textFileTest }: { textFileTest: string }): string[] => {
  let completeTextFileText: string = `\n${textFileTest}\n`;

  const listAttemptsGetTestCases: number[] = Array.from(Array(completeTextFileText.split('\n').length).keys());

  const allTestCases: string[] = listAttemptsGetTestCases.map(() => {
    const textNextTestCase: RegExpExecArray = testesTwoSpaceLines.exec(completeTextFileText);
    if (textNextTestCase) {
      completeTextFileText = removeTestCaseExtracted({ completeTextFileText, textNextTestCase });
      return textNextTestCase[0];
    }

    completeTextFileText = removeBreakLines({ completeTextFileText });
    return null;
  });

  return allTestCases.filter((item: string) => !!item === true);
};

export type extractTestCasesFromFileType = {
  cases: ITestCase[];
  title: string;
  order: number;
  description: string;
};

export const extractTestCasesFromFile = ({
  textFileTest,
  directoryAllTests,
}: {
  textFileTest: string;
  directoryAllTests: string;
}): extractTestCasesFromFileType => {
  const testCases: ITestCase[] = [];

  extractTestCasesText({ textFileTest }).forEach((testCaseText: string) => {
    const title: string = getNameTest({ testCaseText });
    const sendContent: contentRequestType = getContentSendTestCase({
      testCaseText,
      textFileTest,
      directoryAllTests,
    });

    const statusCode: number = getStatusCode({ testCaseText });
    const queryParameters: IParameters[] = getQueryParameters({ testCaseText });
    const headers: contentRequestType = getHeader({ testCaseText, textFileTest, directoryAllTests });
    const parameters: IParameters[] = getParameters({ testCaseText, textFileTest });
    const description: string = getDescriptionTest({ testCaseText });
    const method: string = getMethod({ testCaseText });
    const path: string = getRouterParameters({ testCaseText });

    let dynamicBody: contentRequestType = getResponseDynamically({
      testCaseText,
      textFileTest,
      object: {},
      directoryAllTests,
    });

    try {
      dynamicBody = getFirstKeyObject(dynamicBody);
    } catch (error: unknown) {}

    const simpleResponse: contentRequestType = getResponseSimple({
      testCaseText,
      textFileTest,
      directoryAllTests,
    });
    if (simpleResponse) {
      dynamicBody = simpleResponse;
    }

    testCases.push({
      title,
      description,
      method,
      path,
      sendContent,
      parameters: [...parameters, ...queryParameters],
      headers,
      response: {
        statusCode,
        body: dynamicBody,
      },
    });
  });

  const titleSuit: getTitleSuiteType = getTitleSuite({ textFileTest });
  const describeSuit: string = getDescriptionSuite({ textFileTest });
  return {
    cases: testCases,
    title: titleSuit.text,
    description: describeSuit,
    order: titleSuit.order,
  };
};
