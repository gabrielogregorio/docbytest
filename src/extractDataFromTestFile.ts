import { caseType, paramsType, typeExtractDataFromTextType } from './interfaces/extractData';

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
  getContextType,
} from './helpers/helpers';
import { getFirstKeyObject } from './helpers/getFirstKeyObject';

const replaceToMatch = (content: string, fullMatch: RegExpExecArray): string => content.replace(fullMatch[0], '');

const getTests = (fullData2: string, returnDev: boolean): string[] => {
  let content: string = `\n${fullData2}\n`;

  const arrayTry: number[] = Array.from(Array(content.split('\n').length).keys());
  const fullList: string[] = arrayTry.map(() => {
    const testesThreeLines: RegExp = /^^\s{2}(it|test)\(['"`]\s{0,10}\[doc\]\s{0,10}[:-][\s\S]+?\n\s{2}\}\);\n/;

    const contentThreeLines: RegExpExecArray = testesThreeLines.exec(content);

    if (contentThreeLines) {
      content = replaceToMatch(content, contentThreeLines);
      return contentThreeLines[0];
    }

    const testesThreeLinesDev: RegExp =
      /^\s{2}(it|test)\(['"`]\s{0,10}\[dev\]\s{0,10}[:-].{2,300}(\n\s{0,50}.{1,999}){0,50}?\n\s{2}\}\);\n/;
    const contentThreeLinesDev: RegExpExecArray = testesThreeLinesDev.exec(content);
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

  return fullList.filter((item: string) => !!item === true);
};

export const extractDataFromTestFile = (
  oneTestText: string,
  returnDev: boolean,
  pathFull: string,
): typeExtractDataFromTextType => {
  const cases: caseType[] = [];

  getTests(oneTestText, returnDev).forEach((test: string) => {
    const title: string = getContentTest(test);
    const sendContent: string | number | boolean | object = getContentSend(test, oneTestText, pathFull);
    const statusCode: number = getExpectedStatusCode(test);
    const queryParams: paramsType[] = getQueryParams(test);
    const headers: string | number | boolean | object = getSentHeader(test, oneTestText, pathFull);
    const params: paramsType[] = getUrlParams(test, oneTestText);
    const description: string = getDescriptionLocal(test);
    const method: string = getRequestMethod(test);
    const router: string = getRouterRequest(test);
    const fullPath: string = getRouterParams(router);
    let body: string | number | true | object = getExpectedResponseDynamically(test, oneTestText, {}, pathFull);

    try {
      body = getFirstKeyObject(body);
    } catch (error: unknown) {
      //
    }

    const fullBody: string | number | boolean | object = getExpectedResponse(test, oneTestText, pathFull);
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

  const titleSuit: getContextType = getContext(oneTestText);
  const describeSuit: string = getFullDescription(oneTestText);
  return {
    cases,
    title: titleSuit.text,
    order: titleSuit.order,
    description: describeSuit,
  };
};
