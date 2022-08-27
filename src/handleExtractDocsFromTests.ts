import pathNode from 'path';
import fsNode from 'fs';
import { configFileType } from './interfaces/configFile';
import { caseTestType, typeExtractDataFromTextType } from './interfaces/extractData';
import { loadConfigFile } from './helpers/loadConfigFile';
import { extractTestCasesFromFile } from './extractTestCasesFromFile';
import { sortOrder } from './helpers/sortOrder';

type allTestCasesType = {
  [key: string]: { [key2: string]: caseTestType[] };
};

export type makeFullSchemaTestDocsType = {
  paths: allTestCasesType;
  description: string;
  title: String;
  order: number;
};

const generateCompleteSchemaTestDocs = (testCase: typeExtractDataFromTextType): makeFullSchemaTestDocsType => {
  const allTestCases: allTestCasesType = {};

  testCase.cases.forEach((test: caseTestType) => {
    const { path, method } = test;

    try {
      allTestCases[path][method].push(test);
    } catch (error: unknown) {
      const docRouterObjectIsNotMounted: boolean = !allTestCases[path];
      if (docRouterObjectIsNotMounted) {
        allTestCases[path] = {};
      }

      allTestCases[path][method] = [test];
    }
  });

  return {
    paths: allTestCases,
    description: testCase.description,
    title: testCase.title,
    order: testCase.order,
  };
};

const configDocbytest: configFileType = loadConfigFile();

export const handleExtractDocsFromTests = (): makeFullSchemaTestDocsType[] => {
  const directoryAllTests: string = configDocbytest.folderTests;
  const completeDocsByTests: makeFullSchemaTestDocsType[] = [];

  fsNode.readdirSync(directoryAllTests).forEach((testPath: string) => {
    const pathOneTest: string = pathNode.join(directoryAllTests, testPath);

    const textFileTest: string = fsNode.readFileSync(pathOneTest, { encoding: 'utf-8' });

    const testsExtractedFromFile: typeExtractDataFromTextType = extractTestCasesFromFile({
      textFileTest,
      directoryAllTests,
    });

    const existSomeTestExtracted: boolean = testsExtractedFromFile.cases.length !== 0;
    if (existSomeTestExtracted) {
      completeDocsByTests.push(generateCompleteSchemaTestDocs(testsExtractedFromFile));
    }
  });

  return sortOrder<makeFullSchemaTestDocsType>(completeDocsByTests);
};
