import { mountMdTableStatusCode } from './mountMdTableStatusCode';

const reIsSpecialLine = /\[[\w*\s]*\]\((errors_status_table)\)/;
export const mountMdDocs = (mdDoc: string, statusCodeFile: unknown): string => {
  let docMounted = '';
  const linesMdDoc = mdDoc.split('\n');

  linesMdDoc.forEach((lineMdDoc) => {
    const matchIsSpecialLine = reIsSpecialLine.exec(lineMdDoc);

    if (matchIsSpecialLine) {
      const specialLineType = matchIsSpecialLine[1];

      if (specialLineType === 'errors_status_table') {
        const tableMdStatusCode = mountMdTableStatusCode(statusCodeFile);
        docMounted += `${tableMdStatusCode}\n`;
      }
    } else {
      docMounted += `${lineMdDoc}\n`;
    }
  });

  return docMounted;
};
