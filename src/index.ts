import path from 'path';
import fsNode from 'fs';
import { configFileType } from './interfaces/configFile';
import { caseType, typeExtractDataFromTextType } from './interfaces/extractData';
import { loadConfigFile } from './helpers/loadConfigFile';
import { extractDataFromTestFile } from './extractDataFromTestFile';
import { getDocsType } from './interfaces/docs';
import { sortOrder } from './helpers/sortOrder';
import { getDocs } from './handleDocs';

export const CONFIG_FILE_NAME: string = './docbytest.config.json';

type allCasesType = {
  [key: string]: { [key2: string]: { tests: caseType } };
};

type mountDocByTestsType = { paths: allCasesType[]; description: string; title: String; order: number };

const mountDocByTests = (suitCase: typeExtractDataFromTextType): mountDocByTestsType => {
  const allCases: allCasesType[] = [];

  suitCase?.cases?.forEach((test: caseType) => {
    const testPath: string = test.fullPath;
    const testMethod: string = test.method;

    try {
      allCases[testPath][testMethod].tests.push(test);
    } catch (error: unknown) {
      const docRouterObjectIsNotMounted: boolean = !allCases[testPath];
      if (docRouterObjectIsNotMounted) {
        allCases[testPath] = {};
      }

      allCases[testPath][testMethod] = { tests: [test] };
    }
  });

  return { paths: allCases, description: suitCase.description, title: suitCase.title, order: suitCase.order };
};

const mapTestFiles = (directoryTests: string, returnDev: boolean): mountDocByTestsType[] => {
  const fullDocs: mountDocByTestsType[] = [];
  fsNode.readdirSync(directoryTests).forEach((file: string) => {
    const fullPathOneTest: string = path.join(directoryTests, file);

    const fullOneTest: string = fsNode.readFileSync(fullPathOneTest, { encoding: 'utf-8' });
    const testsOneFile: typeExtractDataFromTextType = extractDataFromTestFile(fullOneTest, returnDev, directoryTests);

    const existsTestCases: boolean = testsOneFile.cases.length !== 0;

    if (existsTestCases) {
      const documentationOnFile: mountDocByTestsType = mountDocByTests(testsOneFile);
      fullDocs.push(documentationOnFile);
    }
  });
  return fullDocs;
};

type generateDocsType = {
  statusCode: unknown;
  returnDev?: boolean;
};

const generateDocs = async ({
  statusCode,
  returnDev,
}: generateDocsType): Promise<{
  files: mountDocByTestsType[];
  docs: getDocsType[];
}> => {
  const configs: configFileType = loadConfigFile(CONFIG_FILE_NAME);

  const fullDocs: mountDocByTestsType[] = mapTestFiles(configs.folderTests, returnDev);
  const fullDocsSorted: mountDocByTestsType[] = sortOrder<mountDocByTestsType>(fullDocs);

  const docs: getDocsType[] = await getDocs(configs.docFile, statusCode);

  return { files: fullDocsSorted, docs };
};

generateDocs.defaultProps = {
  returnDev: false,
};

export default generateDocs;
