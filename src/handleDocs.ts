/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import path from 'path';
import { mountMdDocs } from './helpers/mountMdDocs';
import { sortOrder } from './helpers/sortOrder';
import { BIG_SORT_NUMBER } from './constants/variables';
import { dataDocsType, getDocsType } from './interfaces/docs';

const fsPromises = fs.promises;

type getOrderTitleAndFolderDocsType = {
  title: string;
  docs: string[];
};

async function getOrderTitleAndFolderDocs(docFile: string): Promise<getOrderTitleAndFolderDocsType[]> {
  const firstLevelDocFilesOrDirectory: string[] = await fsPromises.readdir(docFile);
  const docFilesWithTitle: getOrderTitleAndFolderDocsType[] = [];

  for (const fileOrDirectory of firstLevelDocFilesOrDirectory) {
    const pathTitleDocs = path.join(docFile, fileOrDirectory);
    const isFolderTitleDocs = fs.lstatSync(pathTitleDocs).isDirectory();

    if (isFolderTitleDocs) {
      const fileDocsInFolderTitle: string[] = await fsPromises.readdir(pathTitleDocs);

      const docFiles: string[] = [];
      fileDocsInFolderTitle.forEach(async (fileOrDirectoryInSecondLevel: string) => {
        const pathDocFile = path.join(docFile, fileOrDirectory, fileOrDirectoryInSecondLevel);
        const docFileIsDirectory = fs.lstatSync(pathDocFile).isDirectory();

        if (!docFileIsDirectory) {
          docFiles.push(pathDocFile);
        }
      });

      docFilesWithTitle.push({
        title: fileOrDirectory,
        docs: docFiles,
      });
    }
  }

  return docFilesWithTitle;
}

function extractContentDocFiles(docFiles: string[], statusCode: unknown): dataDocsType[] {
  return docFiles.map((docFile) => {
    const docContent = fs.readFileSync(docFile, { encoding: 'utf-8' });

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

  const docFilesExtracted = listDocs.map((item: getOrderTitleAndFolderDocsType) => {
    const orderAndTitle = /(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(item.title);

    const docs: dataDocsType[] = extractContentDocFiles(item.docs, statusCode);
    const docsSorted: dataDocsType[] = sortOrder(docs);

    return {
      title: orderAndTitle[3],
      order: Number(orderAndTitle[2]) || BIG_SORT_NUMBER,
      docs: docsSorted,
    };
  });

  return sortOrder(docFilesExtracted);
}
