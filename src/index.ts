import { handleExtractDocsFromTests, makeFullSchemaTestDocsType } from './handleExtractDocsFromTests';
import { getDocsType } from './interfaces/docs';
import { handleMarkdownFiles } from './handleDocs';

type makeDocsType = {
  statusCode: unknown;
};

type makeDocsReturnType = {
  files: makeFullSchemaTestDocsType[];
  docs: getDocsType[];
};

const makeDocs = async ({ statusCode }: makeDocsType): Promise<makeDocsReturnType> => {
  const testDocumentation: makeFullSchemaTestDocsType[] = handleExtractDocsFromTests();
  const markdownDocumentation: getDocsType[] = await handleMarkdownFiles(statusCode);

  return { files: testDocumentation, docs: markdownDocumentation };
};

export default makeDocs;
