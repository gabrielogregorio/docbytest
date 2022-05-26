import fs from 'fs';
import { casesType, typeExtractDataFromTextType } from './interfaces/extractData';

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
} from './helpers/helpers';

export function extractDataFromText(text: string): typeExtractDataFromTextType {
  const cases: casesType[] = [];
  const lines = text.split('\n');
  const titleDescribe = getContext(text);
  const descriptionDescribe = getFullDescription(text);

  let blockItem = '';
  let existsBlockInAnalyzing = false;
  let method = '';
  let router = '';
  let path = '';
  let title = '';
  let description = '';

  lines.forEach((line) => {
    const startAnalyzeNewTest = line.slice(0, 5) === '  it(' || line.slice(0, 7) === '  test(';
    if (startAnalyzeNewTest) {
      blockItem = '';
      existsBlockInAnalyzing = true;
      method = '';
      router = '';
      path = '';
      title = getContentTest(line);
      description = '';
    }

    const finishAnalyzeOneTest = line === '  });';
    if (finishAnalyzeOneTest) {
      existsBlockInAnalyzing = false;
      blockItem = `${blockItem}\n  });`;

      const sendContent = getSendContent(blockItem);
      const statusCode = getStatusCodeExpected(blockItem);
      const body = getResponseExpected(blockItem);
      const queryParams = getQueryParams(blockItem);
      const headers = getHeder(blockItem);
      const params = getUrlParams(router, text);

      cases.push({
        method,
        sendContent,
        params: [...params, ...queryParams],
        title,
        description,
        router,
        path,
        headers,
        response: {
          statusCode,
          body,
        },
      });
    }

    if (existsBlockInAnalyzing) {
      blockItem = `${blockItem}\n${line}`;
      description = description || getDescriptionLocal(line);
      method = method || getTypeMethod(line);
      router = router || getRouterRequest(line);
      path = path || getBaseRouterRequest(line);
    }
  });

  return {
    cases,
    title: titleDescribe,
    description: descriptionDescribe,
  };
}

export function extractDataFromTests(file: string): typeExtractDataFromTextType {
  const text = fs.readFileSync(file, { encoding: 'utf-8' });
  return extractDataFromText(text);
}
