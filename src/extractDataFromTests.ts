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
  getBaseRouterRequest,
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
  let path = '';
  let fullPath = '';
  let title = '';
  let description = '';

  lines.forEach((line) => {
    const startAnalyzeNewTest = line.slice(0, 10) === '  testDoc(';
    if (startAnalyzeNewTest) {
      blockItem = '';
      existsBlockInAnalyzing = true;
      method = '';
      router = '';
      fullPath = '';
      path = '';
      title = getContentTest(line);
      description = '';
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
          path,
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
      description = description || getDescriptionLocal(line);
      method = method || getTypeMethod(line);
      router = router || getRouterRequest(line);
      fullPath = fullPath || getRouterParams(router);
      path = path || getBaseRouterRequest(line);
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
