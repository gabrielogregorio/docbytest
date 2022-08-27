import { statusCodeConfigType } from '@/interfaces/inputLib';
import { mountMdTableStatusCode } from './mountMdTableStatusCode';

const reIsSpecialLine: RegExp = /\[[\w*\s]*\]\((errors_status_table)\)/;
export const mountMdDocs = (mdDoc: string, statusCodeFile: statusCodeConfigType): string => {
  let docMounted: string = '';
  const linesMdDoc: string[] = mdDoc.split('\n');

  linesMdDoc.forEach((lineMdDoc: string) => {
    const matchIsSpecialLine: RegExpExecArray = reIsSpecialLine.exec(lineMdDoc);

    if (matchIsSpecialLine) {
      const specialLineType: string = matchIsSpecialLine[1];

      if (specialLineType === 'errors_status_table') {
        const tableMdStatusCode: string = mountMdTableStatusCode(statusCodeFile);
        docMounted += `${tableMdStatusCode}\n`;
      }
    } else {
      docMounted += `${lineMdDoc}\n`;
    }
  });

  return docMounted;
};
