import fs from 'fs';
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
} from './helpers/helpers';

export function extractDataFromText(oneTestText: string): typeExtractDataFromTextType {
  const cases: caseType[] = [];
  const lines = oneTestText.split('\n');
  const titleSuit = getContext(oneTestText);
  const describeSuit = getFullDescription(oneTestText);

  let blockItem = '';
  let existsBlockInAnalyzing = false;
  let method = '';
  let router = '';
  let fullPath = '';
  let title = '';

  lines.forEach((line) => {
    const reHasStartedNewTest = /^\s*(it|test)\(['"`](\s*\[doc\]\s*[:-]\s*)/;
    const startAnalyzeNewTest = reHasStartedNewTest.exec(line);

    if (startAnalyzeNewTest) {
      blockItem = '';
      existsBlockInAnalyzing = true;
      method = '';
      router = '';
      fullPath = '';
      title = getContentTest(line);
    }

    const finishAnalyzeOneTest = line === '  });';
    if (finishAnalyzeOneTest && existsBlockInAnalyzing) {
      existsBlockInAnalyzing = false;
      blockItem = `${blockItem}\n  });`;

      const sendContent = getSendContent(blockItem, oneTestText);
      const statusCode = getStatusCodeExpected(blockItem);
      const body = getResponseExpected(blockItem, oneTestText);
      const queryParams = getQueryParams(blockItem);
      const headers = getHeder(blockItem, oneTestText);
      const params = getUrlParams(router, oneTestText);
      const description = getDescriptionLocal(blockItem);

      const existsAMethodInAnalyze = method !== '';
      if (existsAMethodInAnalyze) {
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
      }
    }

    if (existsBlockInAnalyzing) {
      blockItem = `${blockItem}\n${line}`;
      method = method || getTypeMethod(line);
      router = router || getRouterRequest(line);
      fullPath = fullPath || getRouterParams(router);
    }
  });

  return {
    cases,
    title: titleSuit,
    description: describeSuit,
  };
}

export function extractDataFromTests(fullPathOneTest: string): typeExtractDataFromTextType {
  const fullOneTest = fs.readFileSync(fullPathOneTest, { encoding: 'utf-8' });
  return extractDataFromText(fullOneTest);
}
