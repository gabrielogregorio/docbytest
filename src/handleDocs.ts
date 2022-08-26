import fsNode from 'fs';
import path from 'path';
import { mountMdDocs } from './helpers/mountMdDocs';
import { sortOrder } from './helpers/sortOrder';
import { BIG_SORT_NUMBER } from './constants/variables';
import { dataDocsType, getDocsType } from './interfaces/docs';

const fsPromises = fsNode.promises;

type getOrderTitleAndFolderDocsType = {
  title: string;
  docs: string[];
};

async function getOrderTitleAndFolderDocs(docFile: string): Promise<getOrderTitleAndFolderDocsType[]> {
  const firstLevelDocFilesOrDirectory: string[] = await fsPromises.readdir(docFile);

  const promises = firstLevelDocFilesOrDirectory.map(async (fileOrDirectory) => {
    const pathTitleDocs = path.join(docFile, fileOrDirectory);
    const isFolderTitleDocs = fsNode.lstatSync(pathTitleDocs).isDirectory();

    if (isFolderTitleDocs) {
      const fileDocsInFolderTitle: string[] = await fsPromises.readdir(pathTitleDocs);

      const docFiles: string[] = [];
      fileDocsInFolderTitle.forEach(async (fileOrDirectoryInSecondLevel: string) => {
        const pathDocFile = path.join(docFile, fileOrDirectory, fileOrDirectoryInSecondLevel);
        const docFileIsDirectory = fsNode.lstatSync(pathDocFile).isDirectory();

        if (!docFileIsDirectory) {
          docFiles.push(pathDocFile);
        }
      });

      return {
        title: fileOrDirectory,
        docs: docFiles,
      };
    }

    return null;
  });

  const docs = await Promise.all(promises);

  return docs.filter((item) => item !== null);
}

function extractContentDocFiles(docFiles: string[], statusCode: unknown): dataDocsType[] {
  return docFiles.map((docFile) => {
    const docContent = fsNode.readFileSync(docFile, { encoding: 'utf-8' });

    const titleAndOrder = /^#\s{0,10}(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(docContent);

    const textWithCorrectlyTitle = docContent.replace(/^#\s{0,10}(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?/, '# ');
    const docsMountedWithStatusCode = mountMdDocs(textWithCorrectlyTitle, statusCode);

    return {
      title: titleAndOrder[3],
      order: Number(titleAndOrder[2]) || BIG_SORT_NUMBER,
      text: docsMountedWithStatusCode,
    };
  });
}

export async function getDocs(docFile: string, statusCode: unknown): Promise<getDocsType[]> {
  const listDocs: getOrderTitleAndFolderDocsType[] = await getOrderTitleAndFolderDocs(docFile);

  const docFilesExtracted: getDocsType[] = listDocs.map((item: getOrderTitleAndFolderDocsType) => {
    const orderAndTitle = /(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(item.title);

    const docs: dataDocsType[] = extractContentDocFiles(item.docs, statusCode);
    const docsSorted: dataDocsType[] = sortOrder<dataDocsType>(docs);

    return {
      title: orderAndTitle[3].toString(),
      order: Number(orderAndTitle[2]) || BIG_SORT_NUMBER,
      docs: docsSorted,
    };
  });

  return sortOrder<getDocsType>(docFilesExtracted);
}
