import fsNode from 'fs';
import path from 'path';

const fsPromises: typeof fsNode.promises = fsNode.promises;

export type getPathAndInfoDocsType = {
  folderDocs: string;
  fileDocs: string[];
};

export const getPathAndInfoDocs = async ({ routeDocs }: { routeDocs: string }): Promise<getPathAndInfoDocsType[]> => {
  const filesOrFolderDoc: string[] = await fsPromises.readdir(routeDocs);

  const promises: Promise<getPathAndInfoDocsType>[] = filesOrFolderDoc.map(
    async (firstFileOrDirectory: string): Promise<getPathAndInfoDocsType> => {
      const pathFileOrFolder: string = path.join(routeDocs, firstFileOrDirectory);

      const isFolderDocs: boolean = fsNode.lstatSync(pathFileOrFolder).isDirectory();
      if (isFolderDocs) {
        const insideFilesDocs: string[] = [];

        const allFilesInsideFolder: string[] = await fsPromises.readdir(pathFileOrFolder);
        allFilesInsideFolder.forEach(async (insideFileOrDirectory: string) => {
          const pathDocFile: string = path.join(routeDocs, firstFileOrDirectory, insideFileOrDirectory);

          const pathIsDirectory: boolean = fsNode.lstatSync(pathDocFile).isDirectory();
          if (!pathIsDirectory) {
            insideFilesDocs.push(pathDocFile);
          }
        });

        const returnTest: getPathAndInfoDocsType = {
          folderDocs: firstFileOrDirectory,
          fileDocs: insideFilesDocs,
        };
        return returnTest;
      }

      return {
        folderDocs: '',
        fileDocs: [],
      };
    },
  );

  const docs: getPathAndInfoDocsType[] = await Promise.all(promises);

  return docs.filter((item: getPathAndInfoDocsType) => item.folderDocs !== '');
};
