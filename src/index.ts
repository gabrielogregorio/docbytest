import { statusCodeConfig } from '@/interfaces/inputLib';
import { handleExtractDocsFromTests, makeFullSchemaTestDocsType } from './handleExtractDocsFromTests';
import { getDocsType } from './interfaces/docs';
import { handleMarkdownFiles } from './handleDocs';

export type makeDocsReturnType = {
  files: makeFullSchemaTestDocsType[];
  docs: getDocsType[];
};

const makeDocs = async (statusCode: statusCodeConfig = null): Promise<makeDocsReturnType> => {
  const testDocumentation: makeFullSchemaTestDocsType[] = handleExtractDocsFromTests();
  const markdownDocumentation: getDocsType[] = await handleMarkdownFiles(statusCode);
  return { files: testDocumentation, docs: markdownDocumentation };
};

export default makeDocs;
