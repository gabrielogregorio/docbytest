import { mergeRecursive } from './helpers/mergeRecursive';
import { caseType, typeExtractDataFromTextType } from './interfaces/extractData';

import {
  getResponseExpected,
  getRouterRequest,
  getTypeMethod,
  getSendContent,
  getStatusCodeExpected,
  getContext,
  getUrlParams,
  getContentTest,
  getDescriptionLocal,
  getFullDescription,
  getQueryParams,
  getHeder,
  getRouterParams,
  getResponseExpectedMountBody,
} from './helpers/helpers';

const replaceToMatch = (content: string, fullMatch: RegExpExecArray) => content.replace(fullMatch[0], '');

const getTests = (fullData2: string, returnDev: boolean) => {
  let content = `\n${fullData2}\n`;

  const arrayTry = Array.from(Array(content.split('\n').length).keys());
  const fullList = arrayTry.map(() => {
    const testesThreeLines =
      /^\s{2}(it|test)\(['"`]\s{0,10}\[doc\]\s{0,10}[:-].{2,300}(\n\s{0,50}.{1,999}){0,50}?\n\s{2}\}\);\n/;
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

export function extractDataFromTestFile(oneTestText: string, returnDev?: boolean): typeExtractDataFromTextType {
  const cases: caseType[] = [];

  getTests(oneTestText, returnDev).forEach((test) => {
    const title = getContentTest(test);
    const sendContent = getSendContent(test, oneTestText);
    const statusCode = getStatusCodeExpected(test);
    let body = getResponseExpectedMountBody(test, oneTestText, {});
    const queryParams = getQueryParams(test);
    const headers = getHeder(test, oneTestText);
    const params = getUrlParams(test, oneTestText);
    const description = getDescriptionLocal(test);
    const method = getTypeMethod(test);
    const router = getRouterRequest(test);
    const fullPath = getRouterParams(router);

    const fullBody = getResponseExpected(test, oneTestText);
    try {
      body = mergeRecursive(JSON.parse(body || {}), fullBody);
    } catch (error) {
      if (fullBody) {
        body = fullBody;
      }
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
