import fsNode from 'fs';
import path from 'path';
import { loadConfigFile } from '@/helpers/loadConfigFile';
import { configFileType } from '@/interfaces/configFile';
import { mountMdDocs } from './helpers/mountMdDocs';
import { sortOrder } from './helpers/sortOrder';
import { BIG_SORT_NUMBER } from './constants/variables';
import { dataDocsType, getDocsType } from './interfaces/docs';

const fsPromises: typeof fsNode.promises = fsNode.promises;

type getOrderTitleAndFolderDocsType = {
  title: string;
  docs: string[];
};

const getOrderTitleAndFolderDocs = async (docFile: string): Promise<getOrderTitleAndFolderDocsType[]> => {
  const firstLevelDocFilesOrDirectory: string[] = await fsPromises.readdir(docFile);

  const promises: Promise<getOrderTitleAndFolderDocsType>[] = firstLevelDocFilesOrDirectory.map(
    async (fileOrDirectory: string): Promise<getOrderTitleAndFolderDocsType> => {
      const pathTitleDocs: string = path.join(docFile, fileOrDirectory);
      const isFolderTitleDocs: boolean = fsNode.lstatSync(pathTitleDocs).isDirectory();

      if (isFolderTitleDocs) {
        const fileDocsInFolderTitle: string[] = await fsPromises.readdir(pathTitleDocs);

        const docFiles: string[] = [];
        fileDocsInFolderTitle.forEach(async (fileOrDirectoryInSecondLevel: string) => {
          const pathDocFile: string = path.join(docFile, fileOrDirectory, fileOrDirectoryInSecondLevel);
          const docFileIsDirectory: boolean = fsNode.lstatSync(pathDocFile).isDirectory();

          if (!docFileIsDirectory) {
            docFiles.push(pathDocFile);
          }
        });

        const returnTest: getOrderTitleAndFolderDocsType = {
          title: fileOrDirectory,
          docs: docFiles,
        };
        return returnTest;
      }

      return null;
    },
  );

  const docs: getOrderTitleAndFolderDocsType[] = await Promise.all(promises);

  return docs.filter((item: getOrderTitleAndFolderDocsType) => item !== null);
};

const extractContentDocFiles = (docFiles: string[], statusCode: unknown): dataDocsType[] =>
  docFiles.map((docFile: string) => {
    const docContent: string = fsNode.readFileSync(docFile, { encoding: 'utf-8' });

    const titleAndOrder: RegExpExecArray = /^#\s{0,10}(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(
      docContent,
    );

    const textWithCorrectlyTitle: string = docContent.replace(
      /^#\s{0,10}(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?/,
      '# ',
    );
    const docsMountedWithStatusCode: string = mountMdDocs(textWithCorrectlyTitle, statusCode);

    return {
      title: titleAndOrder[3],
      order: Number(titleAndOrder[2]) || BIG_SORT_NUMBER,
      text: docsMountedWithStatusCode,
    };
  });

export const handleMarkdownFiles = async (statusCode: unknown): Promise<getDocsType[]> => {
  const configDocbytest: configFileType = loadConfigFile();
  const { docFile } = configDocbytest;

  const listDocs: getOrderTitleAndFolderDocsType[] = await getOrderTitleAndFolderDocs(docFile);

  const docFilesExtracted: getDocsType[] = listDocs.map((item: getOrderTitleAndFolderDocsType) => {
    const orderAndTitle: RegExpExecArray = /(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/.exec(item.title);

    const docs: dataDocsType[] = extractContentDocFiles(item.docs, statusCode);
    const docsSorted: dataDocsType[] = sortOrder<dataDocsType>(docs);

    return {
      title: orderAndTitle[3].toString(),
      order: Number(orderAndTitle[2]) || BIG_SORT_NUMBER,
      docs: docsSorted,
    };
  });

  return sortOrder<getDocsType>(docFilesExtracted);
};
