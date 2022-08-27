import { ITestCase } from '@/interfaces/extractData';
import { extractTestCasesFromFileType } from 'src/extractTestCasesFromFile';

export type allTestCasesType = {
  [key: string]: { [key2: string]: ITestCase[] };
};

export type makeFullSchemaTestDocsType = {
  paths: allTestCasesType;
  description: string;
  title: string;
  order: number;
};

export const generateCompleteSchemaTestDocs = (testCase: extractTestCasesFromFileType): makeFullSchemaTestDocsType => {
  const allTestCases: allTestCasesType = {};

  testCase.cases.forEach((test: ITestCase) => {
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
