import path from 'path';
import fs from 'fs';
import { configFileType } from './interfaces/configFile';
import { casesType, typeExtractDataFromTextType } from './interfaces/extractData';
import { loadConfigFile } from './helpers/loadConfigFile';
import { extractDataFromTests } from './extractDataFromTests';
import { configFileName } from './constants/folders';

function mountDocWorkingAllTests(oneDoc: typeExtractDataFromTextType) {
  const docMounted = [];
  oneDoc?.cases?.forEach((doc: casesType) => {
    const docObjectIsNotMounted = docMounted[doc.path]?.[doc.method] !== undefined;

    if (docObjectIsNotMounted) {
      docMounted[doc.path][doc.method].tests.push(doc);
    } else {
      const docRouterObjectIsNotMounted = !docMounted[doc.path];
      if (docRouterObjectIsNotMounted) {
        docMounted[doc.path] = {};
      }

      docMounted[doc.path][doc.method] = {  tests: [doc] };
    }
  });

  return { ...docMounted, description: oneDoc.description, title: oneDoc.title };
}

export function partialMountDocs(documentation: any, statusCode: any) {
  let finalDocMounted = '';

  const lines = documentation.split('\n');

  const reTestIfSpecialLine = /\[[\w*\s]*\]\((errors_status_table)\)/;
  lines.forEach((line) => {
    const regexRouter = reTestIfSpecialLine.exec(line);

    if (regexRouter) {
      const actionType = regexRouter[1];
      if (actionType === 'errors_status_table') {
        let mountDocsLocal = '| statusCode | description |\n|---------|----------|\n';
        Object.keys(statusCode).forEach((key) => {
          mountDocsLocal += `| ${statusCode[key].code} | ${statusCode[key].description} |\n`;
        });

        finalDocMounted += `${mountDocsLocal}\n`;
      }
    } else {
      finalDocMounted += `${line}\n`;
    }
  });

  return finalDocMounted;
}

export default function generateDocumentation({ statusCode }) {
  const allFilesDocumentation: typeExtractDataFromTextType[] = [];
  let configs: configFileType = {
    folderTests: '',
    docFile: '',
    statusCodeErrorFile: '',
  };

  try {
    configs = loadConfigFile(configFileName);
  } catch (error) {
    return allFilesDocumentation;
  }

  const documentation = fs.readFileSync(configs.docFile, { encoding: 'utf-8' });

  const fullDocumentation = partialMountDocs(documentation, statusCode);

  fs.readdirSync(configs.folderTests).forEach((file) => {
    const fullPathTestFile = path.join(configs.folderTests, file);

    const docFileLocal: typeExtractDataFromTextType = extractDataFromTests(fullPathTestFile);
    const documentationOnFile: any = mountDocWorkingAllTests(docFileLocal);
    allFilesDocumentation.push(documentationOnFile);
  });

  return { paths: allFilesDocumentation, docs: fullDocumentation };
}
