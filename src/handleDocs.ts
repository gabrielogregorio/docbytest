import { loadConfigFile } from '@/helpers/loadConfigFile';
import { configFileType } from '@/interfaces/configFile';
import { statusCodeConfigType } from '@/interfaces/inputLib';
import { extractContentDocFiles } from './extractContentDocFiles';
import { sortOrder } from './helpers/sortOrder';
import { BIG_SORT_NUMBER } from './constants/variables';
import { dataDocsType, getDocsType } from './interfaces/docs';
import { getPathAndInfoDocs, getPathAndInfoDocsType } from './getPathAndInfoDocs';

export const handleMarkdownFiles = async (statusCode: statusCodeConfigType): Promise<getDocsType[]> => {
  const { docFile: routeDocs }: configFileType = loadConfigFile();
  const pathAndInfoDocs: getPathAndInfoDocsType[] = await getPathAndInfoDocs({ routeDocs });

  const docContentExtracted: getDocsType[] = pathAndInfoDocs.map((infoDoc: getPathAndInfoDocsType) => {
    const orderAndTitle: RegExpExecArray = /(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(
      infoDoc.folderDocs,
    );

    const docs: dataDocsType[] = extractContentDocFiles({ fileDocs: infoDoc.fileDocs, statusCode });
    const docsSorted: dataDocsType[] = sortOrder<dataDocsType>(docs);

    return {
      title: orderAndTitle[3].toString(),
      order: Number(orderAndTitle[2]) || BIG_SORT_NUMBER,
      docs: docsSorted,
    };
  });

  return sortOrder<getDocsType>(docContentExtracted);
};
