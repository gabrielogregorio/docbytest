import pathNode from 'path';
import fsNode from 'fs';
import { generateCompleteSchemaTestDocs, makeFullSchemaTestDocsType } from './generateCompleteSchemaTestDocs';
import { configFileType } from './interfaces/configFile';
import { loadConfigFile } from './helpers/loadConfigFile';
import { extractTestCasesFromFile, extractTestCasesFromFileType } from './extractTestCasesFromFile';
import { sortOrder } from './helpers/sortOrder';

const configDocbytest: configFileType = loadConfigFile();

export const handleExtractDocsFromTests = (): makeFullSchemaTestDocsType[] => {
  const directoryAllTests: string = configDocbytest.folderTests;
  const completeDocsByTests: makeFullSchemaTestDocsType[] = [];

  fsNode.readdirSync(directoryAllTests).forEach((testPath: string) => {
    const pathOneTest: string = pathNode.join(directoryAllTests, testPath);

    const textFileTest: string = fsNode.readFileSync(pathOneTest, { encoding: 'utf-8' });

    const testsExtractedFromFile: extractTestCasesFromFileType = extractTestCasesFromFile({
      textFileTest,
      directoryAllTests,
    });

    const existSomeTestExtracted: boolean = !!testsExtractedFromFile.cases.length;
    if (existSomeTestExtracted) {
      completeDocsByTests.push(generateCompleteSchemaTestDocs(testsExtractedFromFile));
    }
  });

  return sortOrder<makeFullSchemaTestDocsType>(completeDocsByTests);
};
