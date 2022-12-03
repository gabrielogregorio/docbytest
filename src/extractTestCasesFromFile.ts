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
import { extractTestCasesText } from './extractTestCasesText';

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
