import fs from 'fs';

import {
  getResponseExpected,
  getRouterRequest,
  getTypeMethod,
  getSendContent,
  getStatusCodeExpected,
  getContext,
  getTypeVariable,
  getContentTest,
  getDescriptionLocal,
  getFullDescription,
} from './helpers';

export function extractDataFromTests(file: string): unknown[] {
  const text = fs.readFileSync(file, { encoding: 'utf-8' });
  const cases: unknown[] = [];
  const regex = /\\$\\{(.*?)\\}`/gi;
  const lines = text.split('\n');

  let blockItem = '';
  let existsBlockInAnalyzing = false;
  let typeMethod = '';
  let routerRequest = '';
  let nameTest = '';
  let descriptionLocal = '';

  const context = getContext(text);
  const commentGlobal = getFullDescription(text);

  lines.forEach((line) => {
    const startAnalyzeNewTest = line.slice(0, 5) === '  it(' || line.slice(0, 7) === '  test(';
    if (startAnalyzeNewTest) {
      blockItem = '';
      existsBlockInAnalyzing = true;
      typeMethod = '';
      routerRequest = '';
      nameTest = getContentTest(line);
      descriptionLocal = '';
    }

    const finishAnalyzeOneTest = line === '  });';
    if (finishAnalyzeOneTest) {
      existsBlockInAnalyzing = false;
      blockItem = `${blockItem}\n  });`;

      const sendContent = getSendContent(blockItem);
      const statusCodeSpect = getStatusCodeExpected(blockItem);
      const expectResponse = getResponseExpected(blockItem);

      const tags = [];

      while (true) {
        const regexRouter = regex.exec(routerRequest);
        if (regexRouter) {
          const nameTag = regexRouter[1];
          tags.push({
            tag: nameTag,
            type: getTypeVariable(nameTag, text).type,
            content: getTypeVariable(nameTag, text).content,
          });
        }

        if (!regexRouter) {
          break;
        }
      }

      cases.push({
        typeMethod,
        expectResponse,
        sendContent,
        tags,
        statusCodeSpect,
        context,
        nameTest,
        descriptionLocal,
        routerRequest,
        commentGlobal,
      });
    }

    if (existsBlockInAnalyzing) {
      blockItem = `${blockItem}\n${line}`;
      descriptionLocal = descriptionLocal || getDescriptionLocal(line);
      typeMethod = typeMethod || getTypeMethod(line);
      routerRequest = routerRequest || getRouterRequest(line);
    }
  });

  return cases;
}
