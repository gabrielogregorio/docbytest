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

      docMounted[doc.path][doc.method] = { context: '', tests: [doc] };
    }
  });

  return { ...docMounted };
}

export default function generateDocumentation() {
  const allFilesDocumentation: typeExtractDataFromTextType[] = [];
  let configs: configFileType = {
    folderTests: '',
  };

  try {
    configs = loadConfigFile(configFileName);
  } catch (error) {
    return allFilesDocumentation;
  }

  fs.readdirSync(configs.folderTests).forEach((file) => {
    const fullPathTestFile = path.join(configs.folderTests, file);

    const docFile: typeExtractDataFromTextType = extractDataFromTests(fullPathTestFile);
    const documentationOnFile: any = mountDocWorkingAllTests(docFile);
    allFilesDocumentation.push(documentationOnFile);
  });

  return allFilesDocumentation;
}
