import { caseTestType, paramsType, typeExtractDataFromTextType } from './interfaces/extractData';

import {
  getResponseSimple,
  getRouter,
  getMethod,
  getContentSendTestCase,
  getStatusCode,
  getTitleSuite,
  getParams,
  getNameTest,
  getDescriptionTest,
  getDescriptionSuite,
  getQueryParams,
  getHeader,
  getRouterParams,
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

export const extractTestCasesFromFile = ({
  textFileTest,
  directoryAllTests,
}: {
  textFileTest: string;
  directoryAllTests: string;
}): typeExtractDataFromTextType => {
  const testCases: caseTestType[] = [];

  extractTestCasesText({ textFileTest }).forEach((testCaseText: string) => {
    const title: string = getNameTest({ testCaseText });
    const sendContent: string | number | boolean | object = getContentSendTestCase({
      testCaseText,
      textFileTest,
      directoryAllTests,
    });
    const statusCode: number = getStatusCode({ testCaseText });
    const queryParams: paramsType[] = getQueryParams({ testCaseText });
    const headers: string | number | boolean | object = getHeader({ testCaseText, textFileTest, directoryAllTests });
    const params: paramsType[] = getParams({ testCaseText, textFileTest });
    const description: string = getDescriptionTest({ testCaseText });
    const method: string = getMethod({ testCaseText });
    const router: string = getRouter({ testCaseText });
    const fullPath: string = getRouterParams({ router });

    let dynamicBody: string | number | true | object = getResponseDynamically({
      testCaseText,
      textFileTest,
      object: {},
      directoryAllTests,
    });

    try {
      dynamicBody = getFirstKeyObject(dynamicBody);
    } catch (error: unknown) {}

    const simpleResponse: string | number | boolean | object = getResponseSimple({
      testCaseText,
      textFileTest,
      directoryAllTests,
    });
    if (simpleResponse) {
      dynamicBody = simpleResponse;
    }

    testCases.push({
      method,
      sendContent,
      params: [...params, ...queryParams],
      title,
      description,
      fullPath,
      router,
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
    order: titleSuit.order,
    description: describeSuit,
  };
};
