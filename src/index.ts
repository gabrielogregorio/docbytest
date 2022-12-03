import { statusCodeConfigType } from '@/interfaces/inputLib';
import { getDocsType } from '@/interfaces/docs';
import { makeFullSchemaTestDocsType } from './generateCompleteSchemaTestDocs';
import { handleExtractDocsFromTests } from './handleExtractDocsFromTests';
import { handleMarkdownFiles } from './handleDocs';

export type makeDocsReturnType = {
  suites: makeFullSchemaTestDocsType[];
  docs: getDocsType[];
};

const makeDocs = async (statusCode: statusCodeConfigType | null = null): Promise<makeDocsReturnType> => {
  const testDocumentation: makeFullSchemaTestDocsType[] = handleExtractDocsFromTests();
  const markdownDocumentation: getDocsType[] = await handleMarkdownFiles(statusCode);
  return { suites: testDocumentation, docs: markdownDocumentation };
};

export default makeDocs;
