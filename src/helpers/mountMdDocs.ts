import { statusCodeConfigType } from '@/interfaces/inputLib';
import { mountMdTableStatusCode } from './mountMdTableStatusCode';

const reIsSpecialLine: RegExp = /\[[\w*\s]*\]\((errors_status_table)\)/;
const GROUP_POSITION_SPECIAL_STATUS: number = 1;
export const mountMdDocs = (mdDoc: string, statusCodeFile: statusCodeConfigType): string => {
  let docMounted: string = '';
  const linesMdDoc: string[] = mdDoc.split('\n');

  linesMdDoc.forEach((lineMdDoc: string) => {
    const matchIsSpecialLine: RegExpExecArray = reIsSpecialLine.exec(lineMdDoc);

    if (matchIsSpecialLine) {
      const specialLineType: string = matchIsSpecialLine[GROUP_POSITION_SPECIAL_STATUS];

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
