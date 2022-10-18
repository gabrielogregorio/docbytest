import { loadConfigFile } from './helpers/loadConfigFile';
import { configFileType } from './interfaces/configFile';
import { statusCodeConfigType } from './interfaces/inputLib';
import { extractContentDocFiles } from './extractContentDocFiles';
import { sortOrder } from './helpers/sortOrder';
import { BIG_SORT_NUMBER } from './constants/variables';
import { dataDocsType, getDocsType } from './interfaces/docs';
import { getPathAndInfoDocs, getPathAndInfoDocsType } from './getPathAndInfoDocs';

const GROUP_TITLE: number = 3;
const GROUP_ORDER: number = 2;

export const handleMarkdownFiles = async (statusCode: statusCodeConfigType | null): Promise<getDocsType[]> => {
  const { docFile: routeDocs }: configFileType = loadConfigFile();
  const pathAndInfoDocs: getPathAndInfoDocsType[] = await getPathAndInfoDocs({ routeDocs });

  const docContentExtracted: getDocsType[] = pathAndInfoDocs.map((infoDoc: getPathAndInfoDocsType) => {
    const orderAndTitle: RegExpExecArray | null = /(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(
      infoDoc.folderDocs,
    );

    const docs: dataDocsType[] = extractContentDocFiles({ fileDocs: infoDoc.fileDocs, statusCode });
    const docsSorted: dataDocsType[] = sortOrder<dataDocsType>(docs);

    if (orderAndTitle === null) {
      return {
        title: '',
        order: 0,
        docs: docsSorted,
      };
    }

    return {
      title: orderAndTitle[GROUP_TITLE].toString(),
      order: Number(orderAndTitle[GROUP_ORDER]) || BIG_SORT_NUMBER,
      docs: docsSorted,
    };
  });

  return sortOrder<getDocsType>(docContentExtracted);
};
