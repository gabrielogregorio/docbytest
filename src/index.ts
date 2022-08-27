import { statusCodeConfigType } from '@/interfaces/inputLib';
import { makeFullSchemaTestDocsType } from './generateCompleteSchemaTestDocs';
import { handleExtractDocsFromTests } from './handleExtractDocsFromTests';
import { getDocsType } from './interfaces/docs';
import { handleMarkdownFiles } from './handleDocs';

export type makeDocsReturnType = {
  files: makeFullSchemaTestDocsType[];
  docs: getDocsType[];
};

const makeDocs = async (statusCode: statusCodeConfigType = null): Promise<makeDocsReturnType> => {
  const testDocumentation: makeFullSchemaTestDocsType[] = handleExtractDocsFromTests();
  const markdownDocumentation: getDocsType[] = await handleMarkdownFiles(statusCode);
  return { files: testDocumentation, docs: markdownDocumentation };
};

export default makeDocs;
