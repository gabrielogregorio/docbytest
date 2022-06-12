import path from 'path';
import fs from 'fs';
import { configFileType } from './interfaces/configFile';
import { caseType, typeExtractDataFromTextType } from './interfaces/extractData';
import { loadConfigFile } from './helpers/loadConfigFile';
import { extractDataFromTests } from './extractDataFromTests';
import { configFileName } from './constants/folders';
import { mountMdDocs } from './helpers/mountMdDocs';

function mountDocByTests(suitCase: typeExtractDataFromTextType) {
  const allCases = [];
  suitCase?.cases?.forEach((test: caseType) => {
    const testPath = test.fullPath;
    const testMethod = test.method;

    try {
      allCases[testPath][testMethod].tests.push(test);
    } catch (error) {
      const docRouterObjectIsNotMounted = !allCases[testPath];
      if (docRouterObjectIsNotMounted) {
        allCases[testPath] = {};
      }

      allCases[testPath][testMethod] = { tests: [test] };
    }
  });

  return { paths: { ...allCases }, description: suitCase.description, title: suitCase.title };
}

const mapTestFiles = (folderTests: string) => {
  const fullDocs: typeExtractDataFromTextType[] = [];
  fs.readdirSync(folderTests).forEach((file) => {
    const fullPathOneTest = path.join(folderTests, file);
    const testsOneFile: typeExtractDataFromTextType = extractDataFromTests(fullPathOneTest);
    const existsTestCases = testsOneFile.cases.length !== 0;

    if (existsTestCases) {
      const documentationOnFile: any = mountDocByTests(testsOneFile);
      fullDocs.push(documentationOnFile);
    }
  });
  return fullDocs;
};

export default function generateDocs({ statusCode }: { statusCode: unknown }) {
  const configs: configFileType = loadConfigFile(configFileName);
  const docMd: string = fs.readFileSync(configs.docFile, { encoding: 'utf-8' });

  const docMdFormatted = mountMdDocs(docMd, statusCode);

  const fullDocs: typeExtractDataFromTextType[] = mapTestFiles(configs.folderTests);

  return { files: fullDocs, docs: docMdFormatted };
}
