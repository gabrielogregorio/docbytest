import { statusCodeConfigType } from '../interfaces/inputLib';

export const mountMdTableStatusCode = (statusCodeFile: statusCodeConfigType): string => {
  let mountDocsLocal: string = '| statusCode | description |\n|---------|----------|\n';

  const statusCodeItems: string[] = Object.keys(statusCodeFile);

  statusCodeItems.forEach((key: string) => {
    mountDocsLocal += `| ${statusCodeFile[key].code} | ${statusCodeFile[key].description} |\n`;
  });

  return mountDocsLocal;
};
