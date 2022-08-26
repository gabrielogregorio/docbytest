import { caseType, typeExtractDataFromTextType } from './interfaces/extractData';

import {
  getExpectedResponse,
  getRouterRequest,
  getRequestMethod,
  getContentSend,
  getExpectedStatusCode,
  getContext,
  getUrlParams,
  getContentTest,
  getDescriptionLocal,
  getFullDescription,
  getQueryParams,
  getSentHeader,
  getRouterParams,
  getExpectedResponseDynamically,
} from './helpers/helpers';
import { getFirstKeyObject } from './helpers/getFirstKeyObject';

const replaceToMatch = (content: string, fullMatch: RegExpExecArray): string => content.replace(fullMatch[0], '');

const getTests = (fullData2: string, returnDev: boolean): string[] => {
  let content = `\n${fullData2}\n`;

  const arrayTry = Array.from(Array(content.split('\n').length).keys());
  const fullList = arrayTry.map(() => {
    const testesThreeLines = /^^\s{2}(it|test)\(['"`]\s{0,10}\[doc\]\s{0,10}[:-][\s\S]+?\n\s{2}\}\);\n/;

    const contentThreeLines = testesThreeLines.exec(content);

    if (contentThreeLines) {
      content = replaceToMatch(content, contentThreeLines);
      return contentThreeLines[0];
    }

    const testesThreeLinesDev =
      /^\s{2}(it|test)\(['"`]\s{0,10}\[dev\]\s{0,10}[:-].{2,300}(\n\s{0,50}.{1,999}){0,50}?\n\s{2}\}\);\n/;
    const contentThreeLinesDev = testesThreeLinesDev.exec(content);
    if (contentThreeLinesDev && returnDev) {
      content = replaceToMatch(content, contentThreeLinesDev);
      return contentThreeLinesDev[0];
    }

    content = content.replace(/^.{0,300}\n/, '');
    if (content === '') {
      return '';
    }

    return '';
  });

  return fullList.filter((item) => !!item === true);
};

export function extractDataFromTestFile(
  oneTestText: string,
  returnDev: boolean,
  pathFull: string,
): typeExtractDataFromTextType {
  const cases: caseType[] = [];

  getTests(oneTestText, returnDev).forEach((test) => {
    const title = getContentTest(test);
    const sendContent = getContentSend(test, oneTestText, pathFull);
    const statusCode = getExpectedStatusCode(test);
    const queryParams = getQueryParams(test);
    const headers = getSentHeader(test, oneTestText, pathFull);
    const params = getUrlParams(test, oneTestText);
    const description = getDescriptionLocal(test);
    const method = getRequestMethod(test);
    const router = getRouterRequest(test);
    const fullPath = getRouterParams(router);
    let body: string | number | true | object = getExpectedResponseDynamically(test, oneTestText, {}, pathFull);

    try {
      body = getFirstKeyObject(body);
    } catch (error: unknown) {
      //
    }

    const fullBody = getExpectedResponse(test, oneTestText, pathFull);
    if (fullBody) {
      body = fullBody;
    }

    cases.push({
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
        body,
      },
    });
  });

  const titleSuit = getContext(oneTestText);
  const describeSuit = getFullDescription(oneTestText);
  return {
    cases,
    title: titleSuit.text,
    order: titleSuit.order,
    description: describeSuit,
  };
}
