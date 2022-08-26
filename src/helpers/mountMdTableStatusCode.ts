export const mountMdTableStatusCode = (statusCodeFile: Partial<{ code: number; description: string }>): string => {
  let mountDocsLocal = '| statusCode | description |\n|---------|----------|\n';

  const statusCodeItems = Object.keys(statusCodeFile);

  statusCodeItems.forEach((key) => {
    mountDocsLocal += `| ${statusCodeFile[key].code} | ${statusCodeFile[key].description} |\n`;
  });

  return mountDocsLocal;
};
