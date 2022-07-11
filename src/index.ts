import path from 'path';
import fs from 'fs';
import { configFileType } from './interfaces/configFile';
import { caseType, typeExtractDataFromTextType } from './interfaces/extractData';
import { loadConfigFile } from './helpers/loadConfigFile';
import { extractDataFromTestFile } from './extractDataFromTestFile';
import { getDocsType } from './interfaces/docs';
import { sortOrder } from './helpers/sortOrder';
import { getDocs } from './handleDocs';

export const CONFIG_FILE_NAME = './docbytest.config.json';

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

  return { paths: { ...allCases }, description: suitCase.description, title: suitCase.title, order: suitCase.order };
}

const mapTestFiles = (directoryTests: string, returnDev: boolean) => {
  const fullDocs: typeExtractDataFromTextType[] = [];
  fs.readdirSync(directoryTests).forEach((file) => {
    const fullPathOneTest = path.join(directoryTests, file);

    const fullOneTest = fs.readFileSync(fullPathOneTest, { encoding: 'utf-8' });
    const testsOneFile = extractDataFromTestFile(fullOneTest, returnDev, directoryTests);

    const existsTestCases = testsOneFile.cases.length !== 0;

    if (existsTestCases) {
      const documentationOnFile: any = mountDocByTests(testsOneFile);
      fullDocs.push(documentationOnFile);
    }
  });
  return fullDocs;
};

export default async function generateDocs({ statusCode, returnDev }: { statusCode: unknown; returnDev?: boolean }) {
  const configs: configFileType = loadConfigFile(CONFIG_FILE_NAME);

  const fullDocs: typeExtractDataFromTextType[] = mapTestFiles(configs.folderTests, returnDev);
  const fullDocsSorted = sortOrder(fullDocs);

  const docs: getDocsType[] = await getDocs(configs.docFile, statusCode);

  return { files: fullDocsSorted, docs };
}

generateDocs.defaultProps = {
  returnDev: false,
};
